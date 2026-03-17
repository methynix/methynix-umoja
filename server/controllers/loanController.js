const loanService = require('../services/loanService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * @desc    Mwanachama anaomba mkopo
 * @route   POST /api/v1/loans/request
 * @access  Private (Member)
 */
exports.requestLoan = asyncHandler(async (req, res, next) => {
    const { amount, purpose } = req.body;

    if (!amount || amount <= 0) {
        return next(new AppError('Tafadhali ingiza kiasi halali cha mkopo', 400));
    }

    const loan = await loanService.requestLoan(req.user._id, amount, purpose);
    
    res.status(201).json({
        status: 'success',
        message: 'Ombi la mkopo limetumwa kwa uongozi',
        data: { loan }
    });
});

/**
 * @desc    Mwanachama anaona mikopo yake mwenyewe
 * @route   GET /api/v1/loans/my-loans
 * @access  Private (Member)
 */
exports.getMyLoans = asyncHandler(async (req, res, next) => {
    const loans = await loanService.getUserLoans(req.user._id);
    
    res.status(200).json({
        status: 'success',
        results: loans.length,
        data: { loans }
    });
});

/**
 * @desc    Admin/Secretary anaona mikopo yote ya kikundi chake
 * @route   GET /api/v1/loans/group-loans
 * @access  Private (Admin/Secretary)
 */
exports.getGroupLoans = asyncHandler(async (req, res, next) => {
    // Tunatumia groupCode ya yule Admin aliye-login
    const loans = await loanService.getGroupLoans(req.user.groupCode);
    
    res.status(200).json({
        status: 'success',
        results: loans.length,
        data: { loans }
    });
});

/**
 * @desc    Admin ana-Approve au ku-Reject mkopo
 * @route   PATCH /api/v1/loans/:id/status
 * @access  Private (Admin Only)
 */
exports.updateLoanStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body; // 'approved' au 'rejected'
    const loanId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
        return next(new AppError('Hali (status) isiyo sahihi', 400));
    }

    const updatedLoan = await loanService.updateLoanStatus(
        loanId, 
        status, 
        req.user._id, 
        req.user.groupCode
    );
    
    res.status(200).json({
        status: 'success',
        message: `Mkopo umewekwa hali ya: ${status}`,
        data: { loan: updatedLoan }
    });
});