import User from '../models/User.js';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import FailureResponse, { fixedresponse } from '../utils/FailureResponse.js';
import {
  COMPANY_NOT_FOUND,
  FAILURE,
  INVALID_PASSWORD,
  LOGIN_SUCCESSFUL,
  REGISTRATION_SUCCESSFUL,
  SUCCESS,
  USER_ALEADY_EXISTS,
  USER_NOT_FOUND,
} from '../utils/Constants.js';
import c from 'config';
import Companies from '../models/Company.js';
import Universities from '../models/University.js';
dotenv.config()
const KEY = process.env.secret_key;

// @desc    Login for the Platform
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      const failureResponse = new FailureResponse(FAILURE, USER_NOT_FOUND, '');
      const response = failureResponse.response();
      return res.status(404).json(response);
    }

    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!matchedPassword) {
      const failureResponse = new FailureResponse(
        FAILURE,
        INVALID_PASSWORD,
        ''
      );
      const response = failureResponse.response();
      return res.status(401).json(response);
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      KEY
    );

    console.log(email + password);
    res.status(201).json({
      status: SUCCESS,
      message: LOGIN_SUCCESSFUL,
      data: {
        user: existingUser,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(fixedresponse);
  }
};

const loginCompany = async (req, res) => {
  try {
    const { companyEmail, companyPassword } = req.body;

    const existingCompany = await Companies.findOne({ companyEmail: companyEmail });

    if (!existingCompany) {
      const failureResponse = new FailureResponse(FAILURE, COMPANY_NOT_FOUND, '');
      const response = failureResponse.response();
      return res.status(404).json(response);
    }

    const matchedPassword = await bcrypt.compare(
      companyPassword,
      existingCompany.companyPassword
    );

    if (!matchedPassword) {
      const failureResponse = new FailureResponse(
        FAILURE,
        INVALID_PASSWORD,
        ''
      );
      const response = failureResponse.response();
      return res.status(401).json(response);
    }

    const token = jwt.sign(
      { email: existingCompany.companyEmail, id: existingCompany._id },
      KEY
    );

    // console.log(email + password);
    res.status(201).json({
      status: SUCCESS,
      message: LOGIN_SUCCESSFUL,
      data: {
        user: existingCompany,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(fixedresponse);
  }
};
const loginUniversity = async (req, res) => {
  try {
    const { universityEmail, universityPassword } = req.body;

    const existingUniversities = await Universities.findOne({ universityEmail: universityEmail });

    if (!existingUniversities) {
      const failureResponse = new FailureResponse(FAILURE, COMPANY_NOT_FOUND, '');
      const response = failureResponse.response();
      return res.status(404).json(response);
    }

    const matchedPassword = await bcrypt.compare(
      universityPassword,
      existingUniversities.universityPassword
    );

    if (!matchedPassword) {
      const failureResponse = new FailureResponse(
        FAILURE,
        INVALID_PASSWORD,
        ''
      );
      const response = failureResponse.response();
      return res.status(401).json(response);
    }

    const token = jwt.sign(
      { email: existingUniversities.universityEmail, id: existingUniversities._id },
      KEY
    );

    // console.log(email + password);
    res.status(201).json({
      status: SUCCESS,
      message: LOGIN_SUCCESSFUL,
      data: {
        user: existingUniversities,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(fixedresponse);
  }
};

// @desc    Register as a User/Entrepreneur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log(process.env.secret_key);
    const { firstName, lastName, email, password, userName, userType } = req.body;
    console.log(firstName, lastName, email, password);
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const failureResponse = new FailureResponse(
        FAILURE,
        USER_ALEADY_EXISTS,
        ''
      );
      const response = failureResponse.response();
      return res.status(401).json(response);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      userType: userType
    });

    const token = jwt.sign({ email: result.email, id: result._id }, KEY);

    res.status(201).json({
      status: SUCCESS,
      message: REGISTRATION_SUCCESSFUL,
      data: {
        user: result,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(fixedresponse);
  }
};

export { login, register, loginCompany ,loginUniversity };