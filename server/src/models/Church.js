const mongoose = require('mongoose');

const churchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100
    }
  },
  { timestamps: true }
);

churchSchema.index({ name: 1 });

module.exports = mongoose.model('Church', churchSchema);
