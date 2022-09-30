import User from '../models/User.js';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import FailureResponse, { fixedresponse } from '../utils/FailureResponse.js';
import {
    DATA_FETCHED,
  FAILURE,
  SUCCESS,
  USER_NOT_FOUND,
} from '../utils/Constants.js';

// @desc    Get User Information
// @route   GET /api/user/getInfo
// @access  Private
const getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      const failureResponse = new FailureResponse(FAILURE, USER_NOT_FOUND, '');
      const response = failureResponse.response();
      return res.status(404).json(response);
    }

    res.status(201).json({
      status: SUCCESS,
      message: DATA_FETCHED,
      data: {
        user: user
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(fixedresponse);
  }
};


// @desc    Get All Users
// @route   GET /api/user/getAllUsers
// @access  Public
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(201).json({
            status: SUCCESS,
            message: DATA_FETCHED,
            data: {
              users: users
            },
          });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

export { getInfo, getAllUsers };