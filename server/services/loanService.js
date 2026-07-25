const loanRepository = require('../repositories/loanRepository');
const userRepository = require('../repositories/userRepository');
const User = require('../models/User');
const Group = require('../models/Group');
const { sendSMS } = require('./smsService');
const sms = require('./smsTemplates');
const AppError = require('../utils/AppError');

exports.requestLoan = async (userId, payload) => {
    const {
        amount,
        purpose,
        guarantorInternalName,
        guarantorInternalPhone,
        guarantorExternalName,
        guarantorExternalPhone,
        collateralDescription,
        applicantSignature,
    } = payload;

    const user = await userRepository.findById(userId);
    const group = await Group.findById(user.groupId);
    const threshold = group?.loanThreshold || 0;

    if (!guarantorInternalName || !guarantorInternalPhone) {
        throw new AppError('Mdhamini wa ndani ya kikundi na namba yake ni lazima.', 400);
    }
    if (!guarantorExternalName || !guarantorExternalPhone) {
        throw new AppError('Mdhamini wa nje na namba yake ni lazima.', 400);
    }

    // The internal guarantor must be a real, active member of THIS group —
    // not just any name/number typed into the form.
    const internalPhone = String(guarantorInternalPhone).trim();
    const internalGuarantor = await User.findOne({
        phone: internalPhone,
        groupCode: user.groupCode,
    });
    if (!internalGuarantor) {
        throw new AppError('Mdhamini wa ndani lazima awe mwanachama wa kikundi hiki. Namba uliyoweka haipo kwenye kikundi chako.', 400);
    }
    if (internalGuarantor._id.toString() === user._id.toString()) {
        throw new AppError('Huwezi kujidhamini mwenyewe. Chagua mwanachama mwingine kama mdhamini wa ndani.', 400);
    }
    if (internalGuarantor.status && internalGuarantor.status !== 'active') {
        throw new AppError('Mdhamini wa ndani uliyemchagua bado hajathibitisha akaunti yake.', 400);
    }
    if (!applicantSignature) {
        throw new AppError('Tafadhali weka saini yako kwenye fomu.', 400);
    }

    const collateralType = threshold > 0 && amount > threshold ? 'other' : 'shares';

    if (collateralType === 'other' && (!collateralDescription || !collateralDescription.trim())) {
        throw new AppError('Kiasi ni kikubwa kuliko kikomo; eleza dhamana nyingine utakayoweka.', 400);
    }

    return await loanRepository.create({
        member: userId,
        groupCode: user.groupCode,
        amountRequested: amount,
        purpose,
        guarantorInternalName,
        guarantorInternalPhone,
        guarantorExternalName,
        guarantorExternalPhone,
        collateralType,
        collateralDescription: collateralType === 'other' ? collateralDescription.trim() : 'Hisa za mwombaji',
        applicantSignature,
    });
};

exports.getUserLoans = async (userId) => {
    return await loanRepository.findByMember(userId);
};

exports.getGroupLoans = async (groupCode) => {
    return await loanRepository.findByGroup(groupCode);
};

exports.signLoan = async (loanId, signer, signature) => {
    if (!signature) throw new AppError('Saini haijapatikana', 400);

    const loan = await loanRepository.findById(loanId);
    if (!loan) throw new AppError('Mkopo haujapatikana', 404);
    if (loan.groupCode !== signer.groupCode) {
        throw new AppError('Huna mamlaka ya kusaini fomu hii', 403);
    }

    if (signer.role === 'treasurer') loan.treasurerSignature = signature;
    else if (signer.role === 'secretary') loan.secretarySignature = signature;
    else throw new AppError('Muweka Hazina au Katibu pekee ndio wanaosaini.', 403);

    await loan.save();
    return loan;
};

exports.repayLoan = async (loanId, actor) => {
    const loan = await loanRepository.findById(loanId);
    if (!loan) throw new AppError('Mkopo haujapatikana', 404);
    if (loan.groupCode !== actor.groupCode) {
        throw new AppError('Huna mamlaka ya mkopo huu', 403);
    }
    if (loan.status !== 'approved') {
        throw new AppError('Mkopo huu hauko kwenye hali ya kulipwa.', 400);
    }

    loan.status = 'paid';
    loan.totalPaid = Math.round(loan.amountRequested * (1 + (loan.interestRate || 0) / 100));
    loan.repaidAt = new Date();
    await loan.save();

    const member = await User.findById(loan.member).select('name phone');
    if (member?.phone) {
        sendSMS(member.phone, sms.loanRepaid({ name: member.name, amount: loan.amountRequested }));
    }

    return loan;
};

exports.updateLoanStatus = async (loanId, status, approver) => {
    const loan = await loanRepository.findById(loanId);

    if (!loan) throw new AppError('Mkopo haujapatikana', 404);

    if (loan.groupCode !== approver.groupCode) {
        throw new AppError('Huna mamlaka ya kuidhinisha mkopo huu', 403);
    }

    const member = await User.findById(loan.member).select('name phone role');
    if (!member) throw new AppError('Mwombaji hajapatikana', 404);

    if (approver.role === 'secretary' && member.role !== 'member') {
        throw new AppError('Maombi ya viongozi yanaidhinishwa na Mwenyekiti (Admin) pekee.', 403);
    }

    if (status === 'approved') {
        if (!loan.treasurerSignature) {
            throw new AppError('Fomu lazima isainiwe na Muweka Hazina kabla ya kuidhinishwa.', 400);
        }
        if (!loan.secretarySignature) {
            throw new AppError('Fomu lazima isainiwe na Katibu kabla ya kuidhinishwa.', 400);
        }
    }

    const updated = await loanRepository.updateStatus(loanId, status, approver._id);

    if (member.phone) {
        const msgFn = status === 'approved' ? sms.loanApproved : sms.loanRejected;
        sendSMS(member.phone, msgFn({ name: member.name, amount: loan.amountRequested }));
    }

    return updated;
};
