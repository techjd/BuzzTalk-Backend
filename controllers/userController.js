import FailureResponse, { fixedresponse } from '../utils/FailureResponse.js';
import {
    ALL_FOLLOWERS,
    DATA_FETCHED,
    FAILURE,
    SUCCESS,
    USER_ALREADY_FOLLOWED,
    USER_FOLLOWED,
    USER_NOT_FOLLOWED,
    USER_NOT_FOUND,
    USER_UNFOLLOWED,
} from '../utils/Constants.js';
import FollowerFollowing from '../models/FollowerFollowing.js';
import User from '../models/User.js';
import mongoose , { ObjectId } from 'mongoose';

// @desc    Get User Information for Personal Profile
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

// @desc    Get User Information for Other Users on Platform
// @route   GET /api/user/getOtherUserInfo
// @access  Private
const getOthersInfo = async (req, res) => {
    try {

        const { userId } = req.body;
        // console.log("WHT" + ObjectId(userId.trim()))
        // let objectId = mongoose.Types.ObjectId(userId.trim());
        // console.log("WHT" + objectId)
        const user = await User.findById(userId.trim()).select('-password')
        
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
// @access  Private
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

// @desc    Follow A User
// @route   POST /api/user/follow
// @access  Private
const follow = async (req, res) => {
    try {
        const { followeeID } = req.body;
        
        const user = await FollowerFollowing.findOne({"followeeID": followeeID})
                
        if (user) {
            const failureResponse = new FailureResponse(FAILURE, USER_ALREADY_FOLLOWED, '');
            const response = failureResponse.response();
            return res.status(201).json(response);
        }
        
        const relation = new FollowerFollowing({
            followerId: req.userId,
            followeeId: followeeID
        })
        
        await relation.save()

        res.status(201).json({
            status: SUCCESS,
            message: USER_FOLLOWED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Check if User is followed or not
// @route   POST /api/user/follow
// @access  Private
const checkIfUserFollowedOrNot = async (req, res) => {
    try {
        const { followeeID } = req.body;
        
        const user = await FollowerFollowing.findOne({"followeeID": followeeID})
                
        if (user) {
            const failureResponse = new FailureResponse(SUCCESS, USER_FOLLOWED, '');
            const response = failureResponse.response();
            return res.status(201).json(response);
        }

        res.status(201).json({
            status: SUCCESS,
            message: USER_NOT_FOLLOWED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Get All Followers
// @route   GET /api/user/getFollowers
// @access  Private
const getAllFollowers = async (req, res) => {
    try {
        const followers = await FollowerFollowing.find({ "followeeId": req.userId })
        
        res.status(201).json({
            status: SUCCESS,
            message: ALL_FOLLOWERS,
            data: {
                followers: followers
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Get All Following
// @route   GET /api/user/getFollowing
// @access  Private
const getAllFollowing = async (req, res) => {
    try {
        const following = await FollowerFollowing.find({"followerId": req.userId}).populate({path: 'followerId', select: '-password', })
        console.log("this is called")
        res.status(201).json({
            status: SUCCESS,
            message: ALL_FOLLOWERS,
            data: {
                following: following
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
} 


// @desc    Get All Followers and Followinf
// @route   GET /api/user/getAllFollowersAndFollowing
// @access  Private

const getAllFollowersAndFollowing = async (req, res) => {
    try {

        const { userID } = req.body

        const followers = await FollowerFollowing.find({ "followeeId": userID }).populate('followeeId').populate('followerId')
        const following = await FollowerFollowing.find({ "followerId": `userID` }).populate('followeeId').populate('followerId')
        
        res.status(201).json({
            status: SUCCESS,
            message: ALL_FOLLOWERS,
            data: {
                followers: followers,
                following: following
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Unfollow A User
// @route   GET /api/user/unfollow
// @access  Private
const unfollow = async (req, res) => {
    try {
        const { followeeID } = req.body;

        const user = await FollowerFollowing.findOne({"followeeID": followeeID})
                
        if (!user) {
            const failureResponse = new FailureResponse(FAILURE, USER_NOT_FOLLOWED, '');
            const response = failureResponse.response();
            return res.status(404).json(response);
        }

        await FollowerFollowing.deleteOne({"followeeID": followeeID})

        res.status(201).json({
            status: SUCCESS,
            message: USER_UNFOLLOWED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}




export { getInfo, getOthersInfo , getAllUsers, follow, getAllFollowersAndFollowing, getAllFollowers, getAllFollowing, unfollow, checkIfUserFollowedOrNot };