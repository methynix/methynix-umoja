const Loan = require('../models/Loan');

class LoanRepository {
    async create(loanData) {
        return await Loan.create(loanData);
    }

    async findByGroup(groupCode) {
        return await Loan.find({ groupCode }).populate('member', 'name phone');
    }

    async findByMember(memberId) {
        return await Loan.find({ member: memberId }).sort('-createdAt');
    }

    async updateStatus(loanId, status, adminId) {
        return await Loan.findByIdAndUpdate(loanId, { 
            status, 
            approvedBy: adminId 
        }, { new: true });
    }
}

module.exports = new LoanRepository();