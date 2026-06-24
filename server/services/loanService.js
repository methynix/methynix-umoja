const loanRepository = require('../repositories/loanRepository');
const userRepository = require('../repositories/userRepository');
const User = require('../models/User');
const Group = require('../models/Group');
const { sendSMS } = require('./smsService');
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
    if (!applicantSignature) {
        throw new AppError('Tafadhali weka saini yako kwenye fomu.', 400);
    }

    const collateralType = threshold > 0 && amount > threshold ? 'other' : 'shares';

    if (collateralType === 'other' && (!collateralDescription || !collateralDescription.trim())) {
        throw new AppError('Kiasi ni kikubwa kuliko kikomo; eleza dhamana nyingine utakayoweka.', 400);
    }

    if (collateralType === 'shares') {
        const limit = user.shares * 3;
        if (amount > limit) {
            throw new AppError(
                `Kikomo chako ni TZS ${limit.toLocaleString()} (mara 3 ya hisa zako TZS ${user.shares.toLocaleString()}).`,
                400
            );
        }
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
        sendSMS(member.phone, `Habari ${member.name}, mkopo wako wa TZS ${loan.amountRequested.toLocaleString()} umekamilika kulipwa. Asante! - Methynix Umoja`);
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
        const hasTreasurer = await User.exists({ groupCode: loan.groupCode, role: 'treasurer' });
        if (hasTreasurer && !loan.treasurerSignature) {
            throw new AppError('Fomu lazima isainiwe na Muweka Hazina kabla ya kuidhinishwa.', 400);
        }
        if (!loan.secretarySignature) {
            throw new AppError('Fomu lazima isainiwe na Katibu kabla ya kuidhinishwa.', 400);
        }
    }

    const updated = await loanRepository.updateStatus(loanId, status, approver._id);

    if (member.phone) {
        const amount = loan.amountRequested.toLocaleString();
        const msg =
            status === 'approved'
                ? `Habari ${member.name}, mkopo wako wa TZS ${amount} UMEIDHINISHWA na Methynix Umoja.`
                : `Habari ${member.name}, samahani, ombi lako la mkopo wa TZS ${amount} HALIKUKUBALIWA. Wasiliana na uongozi wa kikundi.`;
        sendSMS(member.phone, msg);
    }

    return updated;
};
