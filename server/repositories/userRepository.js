const User = require('../models/User');

class UserRepository {
    async findById(id) {
        return await User.findById(id);
    }

    async findByPhone(phone) {
        return await User.findOne({ phone }).select('+password');
    }

    // SCOPED FETCHING: Crucial for production security
    async findAllScoped(requestingUser) {
        const query = requestingUser.role === 'superadmin' 
            ? {} 
            : { groupCode: requestingUser.groupCode };
        return await User.find(query).sort('-createdAt');
    }

    async create(userData) {
        return await User.create(userData);
    }

    async updateStats(userId, shareAmount, socialAmount) {
        return await User.findByIdAndUpdate(userId, {
            $inc: { shares: shareAmount, socialFund: socialAmount }
        }, { new: true });
    }
}

module.exports = new UserRepository();