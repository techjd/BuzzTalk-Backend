import mongoose from 'mongoose';
import { PROFESSIONAL_USERS, PROFESSORS, RESEARCH_SCHOLARS, STUDENTS } from '../utils/Constants.js';

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    notificationId: {
      type: String
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum : [
        PROFESSORS,
        STUDENTS,
        PROFESSIONAL_USERS,
        RESEARCH_SCHOLARS
      ],
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('users', UserSchema);
export default User;