import Conversations from "../models/Conversations.js";
import OnlineUsers from "../models/OnlineUsers.js";
import Messages from "../models/Messages.js";
import FailureResponse, { fixedresponse } from '../utils/FailureResponse.js';
import { ALL_CONVERSATIONS, ALL_MESSAGES, GET_ALL_USER_GROUPS, GROUP_CREATED_SUCCESSFULLY, GROUP_MESSAGES, GROUP_MESSAGE_SENT, MESSAGE_SUCCESSFULLY_SENT_FOR_FUTURE, MESSAGE_SUCCESSFULLY_SENT_WHEN_ONLINE, NEW_MESSAGE, SUCCESS, USER_ADDED_TO_ONLINE_LIST, USER_ALREADY_ONLINE, USER_NOT_FOUND_IN_ONLINE_LIST, USER_OFFLINE, USER_ONLINE, USER_REMOVED_FROM_ONLNE_LIST } from "../utils/Constants.js";
import mongoose from "mongoose";
import Groups from "../models/Groups.js";
import GroupMembers from "../models/GroupMembers.js";
import GroupMessages from "../models/GroupMessages.js";
import User from "../models/User.js";


// @route  POST api/chat/makeMeOnline
// @desc   Add Current Logged In User To Online List
// @access Private

const makeMeOnline = async (req, res) => {
    try {
        const { socketId } = req.body;
        
        const isUserOnline = await OnlineUsers.findOne({
            user: req.userId
        })
        
        // Compare it with the old socket id !!
        
        if (isUserOnline) {
            // console.log(req.io)
            if (isUserOnline.socketId != socketId) {
                isUserOnline.socketId = socketId
            }
            await isUserOnline.save();
            const failureResponse = new FailureResponse(SUCCESS, USER_ALREADY_ONLINE, '');
            const response = failureResponse.response();
            return res.status(201).json(response);
        }
        
        const newOnlineUser = new OnlineUsers({
            user: req.userId,
            socketId: socketId,
        });
        
        await newOnlineUser.save();

        const user = await User.findById(req.userId)

        const groups = await GroupMembers.find({ userId: req.userId })
        
        // req.io.on("connection", (socket) => {
        //   socket.on("grp", (data) => {
        //     console.log("Over Here ")     
        //   })   
        // })

        // if(groups) {
        //     for(const group in groups) {
        //         req.socket.join(group.id)
        //     }
        // }

        res.status(201).json({
            status: SUCCESS,
            message: USER_ADDED_TO_ONLINE_LIST,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  DELETE api/chat/removeMeOnline
// @desc   Delete User From Online List
// @access Private

const removeMeOnline = async (req, res) => {
    try {
        const user = await OnlineUsers.findOne({ user: req.userId });
        
        if (user) {
            await user.remove()
            
            return res.status(201).json({
                status: SUCCESS,
                message: USER_REMOVED_FROM_ONLNE_LIST,
                data: ''
            });
        }

        const groups = await GroupMembers.find({ userId: req.userId })

        if(groups) {
            for(const group in groups) {
                req.socket.leave(group.id)
            }
        }
        
        res.status(201).json({
            status: SUCCESS,
            message: USER_NOT_FOUND_IN_ONLINE_LIST,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/chat/sendMessage
// @desc   Send Message to a Specific Person
// @access Private

const sendMessage = async(req, res) => {
    try {
        const { to, messageBody } = req.body;
        
        const filter = {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(req.userId) } },
                    { $elemMatch: { $eq: mongoose.Types.ObjectId(to) } },
                ],
            },
        };
        
        const update = {
            recipients: [req.userId, to],
            lastMessage: messageBody
        };
        
        const options = {
            upsert: true, 
            new: true, 
            setDefaultsOnInsert: true
        }
        
        const conversation = await Conversations.findOneAndUpdate(filter, update, options);
        
        const msg = new Messages({
            conversation: conversation._id,
            from: req.userId,
            to: to,
            body: messageBody
        })
        
        const message = await msg.save();
        
        const isUserOnline = await OnlineUsers.findOne({ user: mongoose.Types.ObjectId(to) });
        
        const messageToSend = {
            status: SUCCESS,
            message: NEW_MESSAGE,
            data: {
                message: message
            }
        }
        
        if (isUserOnline) {
            req.io.to(isUserOnline.socketId).emit(NEW_MESSAGE, messageToSend)
            
            return res.status(201).json({
                status: SUCCESS,
                message: MESSAGE_SUCCESSFULLY_SENT_WHEN_ONLINE,
                data: ''
            });
        }
        
        res.status(201).json({
            status: SUCCESS,
            message: MESSAGE_SUCCESSFULLY_SENT_FOR_FUTURE,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  GET api/chat/getAllMessages
// @desc   Get All Messages Between Two Person
// @access Private
const getAllMessages = async(req, res) => {
    try {
        const { to } = req.body;
        
        const messages = await Messages.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'toObj',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'fromObj',
                },
            },
        ])
        .match({
            $or: [
                {
                    $and: [
                        { to: mongoose.Types.ObjectId(to) },
                        { from: mongoose.Types.ObjectId(req.userId) },
                    ],
                },
                {
                    $and: [
                        { to: mongoose.Types.ObjectId(req.userId) },
                        { from: mongoose.Types.ObjectId(to) },
                    ],
                },
            ],
        })
        .project({
            'toObj.password': 0,
            'toObj.__v': 0,
            'fromObj.password': 0,
            'fromObj.__v': 0,
        });
        
        res.status(201).json({
            status: SUCCESS,
            message: ALL_MESSAGES,
            data: {
                messages: messages
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  GET api/chat/getAllConversations
// @desc   Get All Conversations of a Specific User
// @access Private

const getAllConversations = async (req, res) => {
    try {
        
        const conversations = await Conversations.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'recipients',
                    foreignField: '_id',
                    as: 'recipientObj',
                },
            },
        ])
        .match({
            recipients: {
                $all: [{ $elemMatch: { $eq: mongoose.Types.ObjectId(req.userId) } }],
            },
        })
        .sort({ updatedAt: -1 })
        .project({
            'recipientObj.password': 0,
            'recipientObj.__v': 0,
            'recipientObj.date': 0,
        });
        
        // console.log(conversations)
        
        res.status(201).json({
            status: SUCCESS,
            message: ALL_CONVERSATIONS,
            data: {
                conversations: conversations
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

const getMessagesByDate = async (req, res) => {
    try {
        const { to } = req.body;
        console.log("Request")
        const messages = await Messages.aggregate([
            {
                $project:
                {
                    month: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                }
            },
            {
                $group: {
                    _id: { 
                        month: { $month: "$month" },
                        day: { $dayOfMonth: "$month" },
                        year: { $year: "$month" }
                    },
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'toObj',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'fromObj',
                },
            },
        ])
        .match({
            $or: [
                {
                    $and: [
                        { to: mongoose.Types.ObjectId(to) },
                        { from: mongoose.Types.ObjectId(req.userId) },
                    ],
                },
                {
                    $and: [
                        { to: mongoose.Types.ObjectId(req.userId) },
                        { from: mongoose.Types.ObjectId(to) },
                    ],
                },
            ],
        })
        .project({
            'toObj.password': 0,
            'toObj.__v': 0,
            'fromObj.password': 0,
            'fromObj.__v': 0,
        });
        
        res.status(201).json({
            status: SUCCESS,
            message: ALL_MESSAGES,
            data: {
                messages: messages
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/chat/getUserStatus
// @desc   Get User Status whether he/she is offline or online
// @access Private

const getUserStatus = async (req, res) => {
    try {
        const { to } = req.body
        
        const isUserOnline = await OnlineUsers.findOne({ user: mongoose.Types.ObjectId(to) });
        
        if (isUserOnline) {
            return res.status(201).json({
                status: SUCCESS,
                message: USER_ONLINE,
                data: ''
            });
        }
        
        res.status(201).json({
            status: SUCCESS,
            message: USER_OFFLINE,
            data: ''
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/chat/createGroup
// @desc   Create A New Group
// @access Private

const createGroup = async(req, res) => {
    try {
        const { groupName, groupImage, groupBio, groupUsers } = req.body

        const newGroup = new Groups({
            groupName: groupName,
            groupImage: groupImage,
            groupBio: groupBio,
            lastMessage: "",
            createdBy: req.userId
        })

        const group = await newGroup.save();

        groupUsers.push(req.userId)

        for(const users of groupUsers) {
            const grpUser = new GroupMembers({
                groupId: group.id,
                userId: users
            })

            await grpUser.save()
        }

        return res.status(201).json({
            status: SUCCESS,
            message: GROUP_CREATED_SUCCESSFULLY,
            data: "group created successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse)
    }
} 

// @route  POST api/chat/getGroups
// @desc   Get Groups of Current Users
// @access Private

const getUserGroups = async(req, res) => {
    try {
        const groups = await GroupMembers
        .find({ userId: req.userId })
        .populate({
            path: "groupId"
        })

        return res.status(201).json({
            status: SUCCESS,
            message: GET_ALL_USER_GROUPS,
            data: {
                allGroups: groups
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json(fixedresponse)
    }
}

// @route  GET api/chat/groups/getSingleGroupInfo/{groupId}
// @desc   Send Message To a Group
// @access Private

const getSingleGroupInfo = async(req, res) => {
    try {
        const grpId = req.params.groupId
        const grp = await Groups.findById(grpId)
        const grpMembers = await GroupMembers
                .find({ groupId: grpId })
                .populate({ 
                    path: "userId",
                    select: "-notificationId -password" 
                })

        return res.status(202).json({
            status: SUCCESS,
            message: 'SINGLE GROUP INFO',
            data: {
                groupDetails: grp,
                groupMembers: grpMembers
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json(fixedresponse)
    }
}

// @route  POST api/chat/groups/sendMessage
// @desc   Send Message To a Group
// @access Private

const sendMessageToGroup = async(req , res) => {
    try {
        const { message } = req.body

        const groupId = req.params.groupId

        const grp = await Groups.findById(groupId)
        
        const filter = {
            groupName: grp.groupName
        }

        const update = {
            lastMessage: message
        }

        const options = {
            upsert: true, 
            new: true, 
            setDefaultsOnInsert: true
        }

        await Groups.findOneAndUpdate(filter, update, options)
        
        let grpMsg = new GroupMessages({
            message: message,
            userId: req.userId,
            groupId: groupId
        })

        const messageToSend = {
            status: SUCCESS,
            message: NEW_MESSAGE,
            data: {
                message: grpMsg
            }
        }
        
        await grpMsg.save()

        await grpMsg.populate({ 
            path: "userId",
            select: "-notificationId -password" 
         })
        
         console.log(grpMsg)

        req.io.in(grp.id).emit(NEW_MESSAGE, messageToSend)

        return res.status(201).json({
            status: SUCCESS,
            message: GROUP_MESSAGE_SENT,
            data: ''
        })

    } catch (error) {
        console.error(error)
        res.status(500).json(fixedresponse)
    }
}

// @route  POST api/chat/groups/getAllMessages
// @desc   Get Messages of a Group
// @access Private

const getGroupMessages = async(req, res) => {
    try {
        const grpId = req.params.groupId
        const groupMessages = await GroupMessages
        .find({ groupId: grpId })
        .populate({
            path: "userId",
            select: '-password -notificationId'
        }).sort({
            createdAt: 1
        })

        return res.status(201).json({
            status: SUCCESS,
            message: GROUP_MESSAGES,
            data: {
                groupMesages: groupMessages
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json(fixedresponse)
    }
}
export { 
    makeMeOnline, 
    removeMeOnline, 
    sendMessage, 
    getAllMessages, 
    getAllConversations, 
    getUserStatus, 
    getMessagesByDate,
    createGroup,
    getUserGroups,
    sendMessageToGroup,
    getGroupMessages,
    getSingleGroupInfo
}