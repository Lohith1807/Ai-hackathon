const prisma = require('../prisma/client');

exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const history = await prisma.history.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limit
    });

    const total = await prisma.history.count({
      where: { userId: req.user.id }
    });

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
