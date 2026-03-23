const Group = require('../models/Group');
const User = require('../models/User');

class GroupRepository {
    async create(data) { return await Group.create(data); }

    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const total = await Group.countDocuments();
        const groups = await Group.find().skip(skip).limit(limit).sort('-createdAt');
        return { groups, total, pages: Math.ceil(total / limit) };
    }

    async findMembersByGroup(groupId) {
        // Superadmin view: Just names and roles
        return await User.find({ groupId }).select('name role phone createdAt');
    }
}
module.exports = new GroupRepository();