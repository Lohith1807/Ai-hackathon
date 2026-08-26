const prisma = require('../prisma/client');
const { getTriageResult } = require('../utils/gemini');
const cache = require('../utils/cache');
const { AppError } = require('../middleware/errorHandler');
const crypto = require('crypto');

exports.assessTriage = async (req, res, next) => {
  try {
    const { symptoms, saveHistory } = req.body;

    if (!symptoms || typeof symptoms !== 'string') {
      return next(new AppError('Please provide symptoms as text', 400));
    }

    // Normalize input for caching
    const normalizedSymptoms = symptoms.trim().toLowerCase();
    const hash = crypto.createHash('md5').update(normalizedSymptoms).digest('hex');

    let triageData;
    if (cache.has(hash)) {
      triageData = cache.get(hash);
    } else {
      triageData = await getTriageResult(symptoms);
      cache.set(hash, triageData);
    }

    // Save to history if requested and user is authenticated
    if (saveHistory && req.user) {
      await prisma.history.create({
        data: {
          symptoms: symptoms,
          riskLevel: triageData.riskLevel,
          reasoning: triageData.reasoning,
          recommendation: triageData.recommendation,
          userId: req.user.id
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Triage assessment complete',
      data: triageData
    });

  } catch (error) {
    next(error);
  }
};
