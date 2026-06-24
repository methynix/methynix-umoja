const User = require('../models/User');

class UserRepository {
    async findById(id) {
        return await User.findById(id).populate('groupId');
    }
    async findByPhone(phone) {
        return await User.findOne({ phone }).select('+password');
    }

    async findAllScoped(requestingUser) {
        const query = requestingUser.role === 'superadmin' 
            ? {} 
            : { groupCode: requestingUser.groupCode };
        return await User.find(query).sort('-createdAt');
    }

    async create(userData) {
        return await User.create(userData);
    }

  async updateStats(userId, inc = {}) {
        return await User.findByIdAndUpdate(userId, {
            $inc: {
                shares: inc.shares || 0,
                socialFund: inc.socialFund || 0,
                mawazo: inc.mawazo || 0,
            }
        }, { returnDocument: 'after' });
    }
}

module.exports = new UserRepository();