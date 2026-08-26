const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  reasoning: {
    type: String,
    required: true
  },
  recommendation: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

historySchema.index({ email: 1 });

const History = mongoose.model('History', historySchema);
module.exports = History;
