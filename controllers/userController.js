import FailureResponse, { fixedresponse } from '../utils/FailureResponse.js';
import {
    ALL_CONNECTIONS,
    ALL_CONNECTIONS_REQUESTS,
    ALL_FOLLOWERS,
    DATA_FETCHED,
    FAILURE,
    REQUEST_ACCEPTED,
    REQUEST_NOT_FOUND,
    REQUEST_REJECTED,
    REQUEST_SENT,
    SUCCESS,
    USER_ALREADY_FOLLOWED,
    USER_DISCONNECTED,
    USER_FOLLOWED,
    USER_NOT_CONNECTED,
    USER_NOT_FOLLOWED,
    USER_NOT_FOUND,
    USER_UNFOLLOWED,
} from '../utils/Constants.js';
import FollowerFollowing from '../models/FollowerFollowing.js';
import User from '../models/User.js';
import Connections from '../models/Connections.js';

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
        console.log(followeeID)
        // const user = await FollowerFollowing.findOne({"followeeId": followeeID}) Old One
        
        const user = await FollowerFollowing.findOne({
            $and: [
                {"followeeId": followeeID},
                {"followerId": req.userId}
            ]
        })
        
        if (user) {
            console.log("WTH!!!")
            const failureResponse = new FailureResponse(FAILURE, USER_ALREADY_FOLLOWED, '');
            const response = failureResponse.response();
            return res.status(201).json(response);
        }
        
        const relation = await FollowerFollowing.create({
            followerId: req.userId,
            followeeId: followeeID
        })
        
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
        console.log(followeeID)
        // const user = await FollowerFollowing.findOne({"followeeId": followeeID})
        
        const user = await FollowerFollowing.findOne({
            $and: [
                {"followeeId": followeeID},
                {"followerId": req.userId}
            ]
        })
        
        console.log(user)
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
        const { userId } = req.body
        console.log("Request Came")
        // const followers = await FollowerFollowing.find({ "followeeId": req.userId }).populate({path: 'followeeId', select: '-password'}).populate({path: 'followerId', select: '-password', })
        // const following = await FollowerFollowing.find({ "followerId": req.userId}).populate({path: 'followeeId', select: '-password'}).populate({path: 'followerId', select: '-password', })
        const followers = await FollowerFollowing.find({ "followeeId": userId })
        const following = await FollowerFollowing.find({ "followerId": userId })
        
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

// @desc    Connect To A User
// @route   GET /api/user/connect
// @access  Private
const connect = async(req, res) => {
    try {
        const { toId } = req.body
        console.log("Request Came", toId)
        
        const records = await Connections.findOne({
            $and: [
                {"from": req.userId},
                {"to": toId}
            ]
        })
        
        if (records) {
            const failureResponse = new FailureResponse(FAILURE, records.status, '');
            const response = failureResponse.response();
            return res.status(404).json(response);
        }
        
        await Connections.create({
            from: req.userId,
            to: toId,
            status: REQUEST_SENT
        })
        
        res.status(201).json({
            status: SUCCESS,
            message: REQUEST_SENT,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Get All Connections Request
// @route   GET /api/user/getAllConnectionsRequest
// @access  Private
const getAllConnectionsRequests = async (req, res) => {
    try {
        const connections = await Connections.find({ 
            $and: [
                {"to": req.userId},
                {"status": REQUEST_SENT}
            ]
        }).populate({path: 'from', select: '-password'})
        .populate({path: 'to', select: '-password', })
        
        res.status(201).json({
            status: SUCCESS,
            message: ALL_CONNECTIONS_REQUESTS,
            data: {
                requests: connections
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Accept A Connection Request
// @route   PUT /api/user/acceptRequest
// @access  Private
const acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.body
        
        const request = await Connections.findById(requestId);
        
        if (!request) {
            const failureResponse = new FailureResponse(FAILURE, REQUEST_NOT_FOUND, '');
            const response = failureResponse.response();
            return res.status(404).json(response);
        }
        
        request.status = REQUEST_ACCEPTED
        
        await request.save()
        
        res.status(201).json({
            status: SUCCESS,
            message: REQUEST_ACCEPTED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Check if request is sent or not
// @route   PUT /api/user/checkIfRequestSentOrNot
// @access  Private
const checkIfRequestSentOrNot = async (req, res) => {
    try {
        const { toId } = req.body;
        
        const user = await Connections.findOne({
            $or: [
                {
                    $and: [
                        {"from": req.userId},
                        {"to": toId}
                    ]       
                },
                {
                    $and: [
                        {"from": toId},
                        {"to": req.userId}
                    ] 
                }
            ]
        })
        
        // const user = await Connections.findOne({
        //     $and: [
        //         {"from": req.userId},
        //         {"to": toId}
        //     ]
        // })
        
        if (user) {
            const failureResponse = new FailureResponse(SUCCESS, user.status, '');
            const response = failureResponse.response();
            return res.status(201).json(response);
        }
        
        res.status(201).json({
            status: SUCCESS,
            message: USER_NOT_CONNECTED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Get All Users Connections
// @route   GET /api/user/getConnections
// @access  Private
const getAllConnections = async (req, res) => {
    try {
        const { userId } = req.body
        console.log("Request Came for Getting All Connection")
        const connections = await Connections.find({
            $and: [
                {   
                    $or: [
                        {from: userId,},
                        {to: userId}
                    ],
                },
                {
                    status: REQUEST_ACCEPTED
                }
            ]
        }).populate({path: 'from', select: '-password', })
        .populate({path: 'to', select: '-password', })
        
        
    //     db.Collections .find({
            
    //         $and: [
    //             {
    //             "status" :  REQUEST_ACCEPTED  
    //             },
    //             {
    //                 $or: [
    //                     {from :  userId},
    //                     {to :  userId}
    //                 ]
    //             }
    //         ]
    // });
    
    // console.log(connections)
    
    res.status(201).json({
        status: SUCCESS,
        message: ALL_CONNECTIONS,
        data: {
            connections: connections
        }
    });
} catch (error) {
    console.log(error);
    res.status(500).json(fixedresponse);
}
}

// @desc    Reject a user's connection
// @route   DELETE /api/user/reject
// @access  Private
const reject = async(req, res) => {
    try {
        const { requestId } = req.body
        
        const request = await Connections.findById(requestId);
        
        if (!request) {
            const failureResponse = new FailureResponse(FAILURE, REQUEST_NOT_FOUND, '');
            const response = failureResponse.response();
            return res.status(404).json(response);
        }
        
        await Connections.findByIdAndDelete(requestId)
        
        res.status(201).json({
            status: SUCCESS,
            message: REQUEST_REJECTED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @desc    Disconnect a connection
// @route   DELETE /api/user/disconnect
// @access  Private

const disconnect = async(req, res) => {
    try {
        const { requestId } = req.body
        
        const request = await Connections.findById(requestId);
        
        if (!request) {
            const failureResponse = new FailureResponse(FAILURE, REQUEST_NOT_FOUND, '');
            const response = failureResponse.response();
            return res.status(404).json(response);
        }
        
        await Connections.findByIdAndDelete(requestId)
        
        res.status(201).json({
            status: SUCCESS,
            message: USER_DISCONNECTED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

export { getInfo, getOthersInfo , getAllUsers, follow, getAllFollowersAndFollowing, getAllFollowers, getAllFollowing, unfollow, checkIfUserFollowedOrNot, connect, getAllConnectionsRequests, acceptRequest, checkIfRequestSentOrNot, getAllConnections, reject, disconnect };