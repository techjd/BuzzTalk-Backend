import Organization from '../models/Organization.js';
import { ORGANIZATION_ALREADY_EXISTS, FAILURE, REGISTRATION_SUCCESSFUL, SUCCESS, ORG_NOT_FOUND, DATA_FETCHED, IS_USER_FOLLOWING, ORG_FOLLOWED, ORG_UNFOLLOWS, LOGIN_SUCCESSFUL } from "../utils/Constants.js";;
import FailureResponse, { fixedresponse } from '../utils/FailureResponse.js';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import OrganizationFollower from '../models/OrganizationFollowers.js';
import Opportunities from '../models/Opportunities.js';
dotenv.config()
const KEY = process.env.secret_key;

// @desc    Register A Organization
// @route   GET /api/org/registerOrg
// @access  Public

const registerOrg = async (req, res) => {
    try {
        const { 
            orgName,
            orgType,
            orgBio,
            orgImage,
            orgWebSite,
            orgPhone,
            orgEmail,
            orgPwd,
            orgUserName
            
        } = req.body;
        

        const findOrg = await Organization.findOne({ organizationEmail: orgEmail })

        if(findOrg) {
            const failureResponse = new FailureResponse(
                FAILURE,
                ORGANIZATION_ALREADY_EXISTS,
                ''
              );
              const response = failureResponse.response();
              return res.status(401).json(response);
        }

        const hashedPassword = await bcrypt.hash(orgPwd, 10);

        const organization = new Organization({
            organizationName: orgName,
            organizationUserName: orgUserName,
            organizationType: orgType,
            organizationBio: orgBio,
            organizationImage: orgImage,
            organizationWebSite: orgWebSite,
            organizationPhone: orgPhone,
            organizationEmail: orgEmail,
            organizationPassword: hashedPassword,
        })
        
        await organization.save()

        const token = jwt.sign({ email: organization.organizationEmail, id: organization._id }, KEY);
        
        res.status(201).json({
            status: SUCCESS,
            message: REGISTRATION_SUCCESSFUL,
            data: {
              organization: organization,
              token: token,
            },
          });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Login A Organization
// @route   GET /api/org/loginOrg
// @access  Public

const loginOrg = async (req, res) => {
    try {
      const { orgEmail, orgPwd } = req.body;
  
      const existingOrg = await Organization.findOne({ organizationEmail: orgEmail });
  
      if (!existingOrg) {
        const failureResponse = new FailureResponse(FAILURE, ORG_NOT_FOUND, '');
        const response = failureResponse.response();
        return res.status(404).json(response);
      }
  
      const matchedPassword = await bcrypt.compare(
        orgPwd,
        existingOrg.organizationPassword
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
        { email: existingOrg.organizationEmail, 
            id: existingOrg._id 
        },
        KEY
      );
  
    //   console.log(email + password);
      res.status(201).json({
        status: SUCCESS,
        message: LOGIN_SUCCESSFUL,
        data: {
          user: existingOrg,
          token: token,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(fixedresponse);
    }
};

// @desc    Get Org Information for Personal Profile
// @route   GET /api/org/getOrgInfo
// @access  Private

const getOrgInfo = async (req, res) => {
    try {
        const org = await Organization.findById(req.userId).select('-organizationPassword')
        
        if (!org) {
            const failureResponse = new FailureResponse(FAILURE, ORG_NOT_FOUND, '');
            const response = failureResponse.response();
            return res.status(404).json(response);
        }
        
        res.status(201).json({
            status: SUCCESS,
            message: DATA_FETCHED,
            data: {
                org: org
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
};

// @desc    Follow an Organization
// @route   GET /api/org/follow
// @access  Private

const followOrg = async(req, res) => {
    try {
        const { userId, orgId } = req.body

        const isUserFollowing = OrganizationFollower.findOne(
            {
                $and: [
                    {"followerId": userId},
                    {"orgId": orgId}
                ]
            }
        )

        if(isUserFollowing) {
            return res.status(201).json({
                status: SUCCESS,
                message: ORG_FOLLOWED,
                data: ''
            })
        }

        const newFollower = new OrganizationFollower({
            followerId: userId,
            orgId: orgId
        })

        await newFollower.save()

        return res.status(201).json({
            status: SUCCESS,
            message: ORG_FOLLOWED,
            data: ''
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

const checkIfUserIsFollowing = async(req, res) => {
    try {
        const { userId, orgId } = req.body

        const isUserFollowing = await OrganizationFollower.findOne(
            {
                $and: [
                    {"followerId": userId},
                    {"orgId": orgId}
                ]
            }
        )

        if(isUserFollowing) {
            return res.status(201).json({
                status: SUCCESS,
                message: IS_USER_FOLLOWING,
                data: true
            })
        }

        return res.status(201).json({
            status: SUCCESS,
            message: IS_USER_FOLLOWING,
            data: false
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse)
    }
}

const unFollow = async(req, res) => {
    try {
        const { userIf, orgId } = req.body

        const isUserFollowing = OrganizationFollower.findOne(
            {
                $and: [
                    {"followerId": userId},
                    {"orgId": orgId}
                ]
            }
        )

        if(isUserFollowing) {
            return res.status(201).json({

            })
        }

        return res.status(201).json({
            status: SUCCESS,
            message: ORG_UNFOLLOWS,
            data: false
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse)
    }
}

const createOppo = async(req, res) => {
    try {
        const { lookingFor, shortDesc, reqSkills, budget, postsFor } = req.body

        const oppo = new Opportunities({
            orgId: req.userId,
            lookingFor: lookingFor,
            shortDescription: shortDesc,
            requiredSkills: reqSkills,
            budget: budget,
            postsFor: postsFor
        })

        await oppo.save()

        return res.status(201).json({
            status: SUCCESS,
            message: "OPPORTUNITY CREATED",
            data: 'CREATED'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse)
    }
}

const getAllOppo = async(req, res) => {
    try {
        const opportunities = await Opportunities.find().populate({
            path: "orgId"
        }).sort({ "createdAt": -1 })

        return res.status(201).json({
            status: SUCCESS,
            message: 'ALL OPPORTUNITIES',
            data: {
                opportunities: opportunities
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse)
    }
}

export { 
    registerOrg, 
    loginOrg ,
    getOrgInfo,
    followOrg,
    checkIfUserIsFollowing,
    createOppo,
    getAllOppo
}