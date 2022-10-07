import mongoose from 'mongoose';

const UniversitySchema = new mongoose.Schema(
  {
    universityName: {
      type: String,
      required: true
    },
    notificationId: {
      type: String
    },
    universityUserName: {
      type: String,
      required: true,
    },
    universityEmail: {
      type: String,
      required: true,
    },
    universityPassword: {
      type: String,
      required: true,
    },
    universityWebSiteLink: {
        type: String,
        required: true
    },
    universityLocation: {
        type: String,
        required: true
    },
    universityPhone: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Universities = mongoose.model('universities',  UniversitySchema);
export default Universities;