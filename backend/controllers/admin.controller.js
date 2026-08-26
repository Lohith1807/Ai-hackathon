const prisma = require('../prisma/client');
const { AppError } = require('../middleware/errorHandler');

exports.getDashboardStats = async (req, res, next) => {
  try {
    // We could add role-checking middleware here, but for the hackathon
    // we'll just fetch the global stats.

    const totalUsers = await prisma.user.count({
      where: { role: 'USER' }
    });

    const totalDoctors = await prisma.doctor.count();
    
    const totalAppointments = await prisma.appointment.count();

    // Get appointments per hospital
    const hospitalStats = await prisma.hospital.findMany({
      include: {
        _count: {
          select: { appointments: true, doctors: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalDoctors,
          totalAppointments
        },
        hospitals: hospitalStats
      }
    });
  } catch (error) {
    next(error);
  }
};
