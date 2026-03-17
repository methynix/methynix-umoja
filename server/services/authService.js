const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const AppError = require('../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.register = async (userData) => {
    const userRepository = require('../repositories/userRepository');
const User = require('../models/User'); // Import model moja kwa moja kwa ajili ya count


    const existingUser = await userRepository.findByPhone(userData.phone);
    if (existingUser) throw new AppError('Namba hii tayari imesajiliwa', 400);

    let assignedRole = 'member';
    
    if (userData.groupCode) {
        const countInGroup = await User.countDocuments({ groupCode: userData.groupCode });
        if (countInGroup === 0) {
            assignedRole = 'admin';
        }
    }

    const { confirmPassword, ...dataToSave } = userData;
    dataToSave.role = assignedRole; 

    const newUser = await userRepository.create(dataToSave);
    const token = signToken(newUser._id);
    
    return { token, user: newUser };
};

exports.login = async (phone, password) => {
    const user = await userRepository.findByPhone(phone);
    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Namba ya simu au Password si sahihi', 401);
    }
    const token = signToken(user._id);
    user.password = undefined; 
    return { token, user };
};