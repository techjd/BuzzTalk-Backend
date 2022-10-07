import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true
    },
    notificationId: {
      type: String
    },
    companyUserName: {
      type: String,
      required: true,
    },
    companyMotto: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
    },
    companyPassword: {
      type: String,
      required: true,
    },
    companyCategory: {
        type: String,
        required: true
    },
    companyWebSiteLink: {
        type: String,
        required: true
    },
    companyLocation: {
        type: String
    },
    companyAbout: {
        type: String,
    },
    companyPhone: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Companies = mongoose.model('companies', CompanySchema);
export default Companies;