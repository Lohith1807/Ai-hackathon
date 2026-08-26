const History = require('../models/History');

exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const history = await History.find({ email: req.user.email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await History.countDocuments({ email: req.user.email });

    res.status(200).json({
      success: true,
      message: 'History fetched successfully',
      data: {
        results: history,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalResults: total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
