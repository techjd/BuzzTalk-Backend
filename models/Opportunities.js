const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OppoSchema = new Schema({
  orgId: {
    type: Schema.Types.ObjectId,
    ref: 'organizations',
  },
  lookingFor: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  requiredSkills: {
    type: String,
    required: true,
  },
  budget: {
    type: String
  },
  postsFor: [ {
    type: String,
    required: true
    }   
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Opportunities = mongoose.model('opportuities', OppoSchema);