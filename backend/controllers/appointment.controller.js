const prisma = require('../prisma/client');
const { AppError } = require('../middleware/errorHandler');

exports.createAppointment = async (req, res, next) => {
  try {
    // Basic auth stub - ideally this comes from JWT middleware
    // We will pass userId from frontend for hackathon speed
    const { userId, hospitalId, doctorId, date, time } = req.body;

    if (!userId || !hospitalId || !doctorId || !date || !time) {
      return next(new AppError('Missing required fields for appointment', 400));
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        hospitalId,
        doctorId,
        date: new Date(date),
        time,
      }
    });

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully!'
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserAppointments = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const appointments = await prisma.appointment.findMany({
      where: { userId },
      include: {
        hospital: true,
        doctor: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};
