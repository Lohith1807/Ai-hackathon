const prisma = require('../prisma/client');
const { AppError } = require('../middleware/errorHandler');

exports.getAllHospitals = async (req, res, next) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        doctors: true,
      },
    });

    res.status(200).json({
      success: true,
      data: hospitals,
    });
  } catch (error) {
    next(error);
  }
};
