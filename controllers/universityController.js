import Universities from "../models/University.js";
import { FAILURE, REGISTRATION_SUCCESSFUL, SUCCESS, UNIVERSITY_ALREADY_EXISTS } from "../utils/Constants.js";
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()
const KEY = process.env.secret_key;

const registerUniversity = async(req, res) => {
    try {

        const { 
            universityName,
            universityUserName,
            universityEmail,
            universityPassword,
            universityWebSiteLink,
            universityLocation,
            universityPhone
        } = req.body;
        
  
        const findUniversity = await Universities.findOne({ universityEmail: universityEmail })

        if(findUniversity) {
            const failureResponse = new FailureResponse(
                FAILURE,
                UNIVERSITY_ALREADY_EXISTS,
                ''
              );
              const response = failureResponse.response();
              return res.status(401).json(response);
        }

        const hashedPassword = await bcrypt.hash(universityPassword, 10);

        const university = new Universities({
            universityUserName: universityUserName,
            universityEmail: universityEmail,
            universityPassword: hashedPassword,
            universityWebSiteLink: universityWebSiteLink,
            universityName: universityName,
            universityPhone: universityPhone,
            universityLocation: universityLocation
        })

        await university.save()

        const token = jwt.sign({ 
            email: university.universityEmail, 
            id: university._id 
        }, KEY);
        
        res.status(201).json({
            status: SUCCESS,
            message: REGISTRATION_SUCCESSFUL,
            data: {
              university: university,
              token: token,
            },
          });
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse);
    }
}

export { registerUniversity }