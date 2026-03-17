const Transaction = require('../models/Transaction');

class TransactionRepository {
    async create(data) {
        return await Transaction.create(data);
    }

    async findByMember(memberId) {
        return await Transaction.find({ member: memberId }).sort('-createdAt');
    }

    async findByGroup(groupCode) {
        return await Transaction.find({ groupCode }).sort('-createdAt').populate('member', 'name phone');
    }
}

module.exports = new TransactionRepository();