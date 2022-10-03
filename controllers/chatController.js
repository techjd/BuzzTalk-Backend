import Conversations from "../models/Conversations.js";
import OnlineUsers from "../models/OnlineUsers.js";
import Messages from "../models/Messages.js";
import FailureResponse, { fixedresponse } from '../utils/FailureResponse.js';
import { ALL_CONVERSATIONS, ALL_MESSAGES, MESSAGE_SUCCESSFULLY_SENT_FOR_FUTURE, MESSAGE_SUCCESSFULLY_SENT_WHEN_ONLINE, NEW_MESSAGE, SUCCESS, USER_ADDED_TO_ONLINE_LIST, USER_ALREADY_ONLINE, USER_NOT_FOUND_IN_ONLINE_LIST, USER_REMOVED_FROM_ONLNE_LIST } from "../utils/Constants.js";
import mongoose from "mongoose";


// @route  POST api/chat/makeMeOnline
// @desc   Add Current Logged In User To Online List
// @access Private

const makeMeOnline = async (req, res) => {
    try {
        const { socketId } = req.body;
        
        const isUserOnline = await OnlineUsers.findOne({
            user: req.userId
        })
        
        // Check if the socketId is new or not !
        
        if (isUserOnline) {
            const failureResponse = new FailureResponse(SUCCESS, USER_ALREADY_ONLINE, '');
            const response = failureResponse.response();
            return res.status(201).json(response);
        }
        
        const newOnlineUser = new OnlineUsers({
            user: req.userId,
            socketId: socketId,
        });
        
        await newOnlineUser.save();
        
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

        console.log(conversations)

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

export { makeMeOnline, removeMeOnline, sendMessage, getAllMessages, getAllConversations }