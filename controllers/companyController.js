import Companies from '../models/Company.js';
import { COMPANY_ALREADY_EXISTS, FAILURE, REGISTRATION_SUCCESSFUL, SUCCESS } from "../utils/Constants.js";;
import FailureResponse, { fixedresponse } from '../utils/FailureResponse.js';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()
const KEY = process.env.secret_key;

// @desc    Register A Company
// @route   GET /api/company/registerCompany
// @access  Public

const registerCompany = async (req, res) => {
    try {
        const { 
            companyName,
            companyUserName,
            companyMotto,
            companyEmail,
            companyPassword,
            companyCategory,
            companyLink,
            companyPhone
            
        } = req.body;
        

        const findCompany = await Companies.findOne({ companyEmail: companyEmail })

        if(findCompany) {
            const failureResponse = new FailureResponse(
                FAILURE,
                COMPANY_ALREADY_EXISTS,
                ''
              );
              const response = failureResponse.response();
              return res.status(401).json(response);
        }

        const hashedPassword = await bcrypt.hash(companyPassword, 10);

        const company = new Companies({
            companyCategory: companyCategory,
            companyUserName: companyUserName,
            companyEmail: companyEmail,
            companyPassword: hashedPassword,
            companyMotto: companyMotto,
            companyWebSiteLink: companyLink,
            companyName: companyName,
            companyPhone: companyPhone,
        })

        await company.save()

        const token = jwt.sign({ email: company.companyEmail, id: company._id }, KEY);
        
        res.status(201).json({
            status: SUCCESS,
            message: REGISTRATION_SUCCESSFUL,
            data: {
              company: company,
              token: token,
            },
          });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}


export { registerCompany }