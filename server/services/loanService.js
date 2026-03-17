// services/loanService.js
const loanRepository = require('../repositories/loanRepository');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

exports.requestLoan = async (userId, amount, purpose) => {
    const user = await userRepository.findById(userId);
    
    // Logic ya 3x Shares Rule
    const limit = user.shares * 3;
    if (amount > limit) {
        throw new AppError(`Kikomo chako ni TZS ${limit.toLocaleString()}. Hisa zako ni TZS ${user.shares.toLocaleString()}`, 400);
    }

    return await loanRepository.create({
        member: userId,
        groupCode: user.groupCode,
        amountRequested: amount,
        purpose
    });
};

exports.getUserLoans = async (userId) => {
    return await loanRepository.findByMember(userId);
};

exports.getGroupLoans = async (groupCode) => {
    return await loanRepository.findByGroup(groupCode);
};

exports.updateLoanStatus = async (loanId, status, adminId, adminGroupCode) => {
    const loan = await loanRepository.findById(loanId);
    
    if (!loan) throw new AppError('Mkopo haujapatikana', 404);

    if (loan.groupCode !== adminGroupCode) {
        throw new AppError('Huna mamlaka ya kuidhinisha mkopo huu', 403);
    }

    return await loanRepository.updateStatus(loanId, status, adminId);
};