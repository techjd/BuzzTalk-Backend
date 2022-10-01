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

// @desc    Follow A User
// @route   POST /api/user/follow
// @access  Public
const follow = async (req, res) => {
    try {
        const { followeeID } = req.body;
        
        const user = await FollowerFollowing.findOne({"followeeID": followeeID})
                
        if (user) {
            const failureResponse = new FailureResponse(FAILURE, USER_ALREADY_FOLLOWED, '');
            const response = failureResponse.response();
            return res.status(404).json(response);
        }
        
        const relation = new FollowerFollowing({
            followerId: req.userId,
            followeeId: followeeID
        })
        
        await relation.save()

        res.status(201).json({
            status: SUCCESS,
            message: USER_FOLLOWED,
            data: {
                relation: relation
            }
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
        const followers = await FollowerFollowing.find({ "followeeId": req.userId }).populate('followeeId').populate('followerId')
        const following = await FollowerFollowing.find({ "followerId": req.userId }).populate('followeeId').populate('followerId')
        
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


export { getInfo, getAllUsers, follow, getAllFollowersAndFollowing, getAllFollowers, getAllFollowing, unfollow };