const Contribution = require('../models/Contribution');

exports.getMemberMonthlyLedger = async (memberId, year) => {
    // 1. Pata malipo yote ya mwaka husika
    const payments = await Contribution.find({ member: memberId, year });

    // 2. Tengeneza "Map" ya malipo kwa ajili ya speed
    const paymentMap = {};
    payments.forEach(p => { paymentMap[p.month] = p; });

    // 3. Tengeneza list ya miezi 12
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth() + 1; // Mwezi wa sasa (1-12)

    return months.map((monthName, index) => {
        const monthNum = index + 1;
        const record = paymentMap[monthNum];

        return {
            month: monthName,
            monthNumber: monthNum,
            amount: record ? record.shareAmount : 0,
            social: record ? record.socialAmount : 0,
            status: record ? 'Paid' : (monthNum < currentMonth ? 'Not Paid' : 'Pending'),
            date: record ? record.createdAt : null
        };
    });
};