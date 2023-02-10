import Feed from '../models/Feed.js';
import FollowerFollowing from '../models/FollowerFollowing.js';
import HashTagsFeed from '../models/HashTagFeed.js';
import HashTags from '../models/Hashtags.js';
import Posts from '../models/Post.js';
import { COMMENT, COMMENTED, FEED, MESSAGE_SUCCESSFULLY_SENT_FOR_FUTURE, MY_FEED, NEW_FEED, POSTADDED, POSTED, SINGLE_POST, SUCCESS, TAGGED } from '../utils/Constants.js';
import FailureResponse, { fixedresponse } from '../utils/FailureResponse.js';
const fcm_server_key = process.env.firebase_fcm_server_key
import { initializeApp } from 'firebase-admin/app';
import admin from "firebase-admin"
const app = initializeApp()
import FCM from "fcm-node"
import Notifications from '../models/Notification.js';
import User from '../models/User.js';
import Universities from '../models/University.js';
import Opportunities from '../models/OpportunitiesByCompany.js';
import OpportunitiesByCompany from '../models/OpportunitiesByCompany.js';
import NewFeed from '../models/NewFeed.js';
import OpportunitiesByUniversity from '../models/OpportunitiesByUniversity.js';
import Comments from '../models/Comments.js';
// var FCM = require('fcm-node');
var serverKey = process.env.firebase_fcm_server_key; //put your server key here
var fcm = new FCM(serverKey);

// @route  POST api/post/addPost
// @desc   Add A New Post to Platform
// @access Private

const addPost = async (req, res) => {
    try {
        const { content, taggedUsers, hashTags } = req.body;

        const currentUser = await User.findById(req.userId);
        
        console.log(typeof hashTags)
        console.log(typeof taggedUsers)
        console.log(content, taggedUsers, hashTags)
        
        // Creating a new post
        const newPost = new Posts({
            userId: req.userId,
            content: content,
            likes: 0,
            comments: 0
        })
        

        // Saving a new post
        const post = await newPost.save();
        
        // Saving all hashtags and generating data for hashtags feed
        for (const hashtag of hashTags) {
            let tag = await HashTags.findOne({ hashTag: hashtag });

            if (!tag) {
                let newTag = new HashTags({
                    hashTag: hashtag
                })

                await newTag.save();
                
                let newHashTagFeed = new HashTagsFeed({
                    postId: post.id,
                    hashtagId: newTag.id
                })
                
                await newHashTagFeed.save();
            } else {
                let newHashTagFeed = new HashTagsFeed({
                    postId: post.id,
                    hashtagId: tag.id
                })
                
                await newHashTagFeed.save();
            }
        }
        
        // Notify Tagged Users
        for (const taggedUser of taggedUsers) {
            console.log("Wth", taggedUser);
            let user = await User.findOne({ userName: taggedUser })
            console.log("In tagged user ", user)
            if (user) {
                // Send them a notification

                // LIKED , COMMENTED OR TAGED
                const notification = new Notifications({
                    userId: user.id, //Enter user id of other user over here,
                    text: TAGGED,
                    postId: newPost.id 
                })  

                await notification.save()
                
                if(user.notificationId) {

                    console.log("sending notification")

                    const message = {
                        to: user.notificationId,
                        collapse_key: "collapse",
            
                        notification: {
                          title: "Buzz Talk",
                          body: `${currentUser.firstName} ${currentUser.lastName} tagged you in their post`
                        },
                      };
                    
    
                    fcm.send(message, function (err, messageID) {
                        if (err) {
                          console.log(err);
                          console.log("Something has gone wrong!");
                        } else {
                          console.log("Sent with message ID: ", messageID);
                        }
                    });
                }
            }
        }
        
        // Publish This Post in the users follower
        const followers = await FollowerFollowing.find({ "followeeId": req.userId }).select("-followeeId")
        
        for(const follower of followers) {
            console.log("In follower")
            
            const newFeed = new Feed({
                postId: post.id,
                type: POSTED,
                userId: req.userId,
                toId: follower.followerId
            })
            
            await newFeed.save()
        }
        
        res.status(201).json({
            status: SUCCESS,
            message: POSTADDED,
            data: ''
        });
        // console.log(followers)
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/newAddPost
// @desc   Add A New Post to Platform
// @access Private

const newAddPost = async (req, res) => {
    try {
        const { title, content, postsFor } = req.body
        
        const post = new Posts({
            userId: req.userId,
            content: content,
            postsFor: postsFor,
            title: title
        })

        await post.save()

        res.status(201).json({
            status: SUCCESS,
            message: POSTADDED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}


// @route  POST api/post/:id
// @desc   Get An Individual Post
// @access Private

const getSinglePost = async (req, res) => {
    try {
        
        const post = await Posts.findById(req.params.id)
        .populate({
            path: "userId",
            select: "-notificationId -password"
        })
        
        res.status(201).json({
            status: SUCCESS,
            message: SINGLE_POST,
            data: {
                post: post
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/getAllSpecificUsersPosts
// @desc   Get All Users post
// @access Private

const getAllSpecificUsersPosts = async (req, res) => {
    try {

        const user = await User.findOne({ userName: "techjd01"})
        console.log(user)

        const message = {
            to:
              "cibAN_L9QiSRM1Cx5mABq1:APA91bGNNBDjxEWfYddOQ5hNkqw-o9KV1jlqEkJ7UvexJKXDrxlY4FGBWQrWOqDcbzZjRZEuAVQYzJMib1ywx231Ux7u91LsbX1nJWI6rZFWTUdIcn6Vm0AsAHfMUlpIAXGyv0cWRYcF",
            collapse_key: "collapse",

            notification: {
              title: "Buzz Talk",
              body: "New Message please check fast"
            },
          };
        
          fcm.send(message, function (err, messageID) {
            if (err) {
              console.log(err);
              console.log("Something has gone wrong!");
            } else {
              console.log("Sent with message ID: ", messageID);
            }
          });

          res.send("Notification sent")
        // const message = {
        //     data: {
        //         score: '850',
        //         time: '2:45'
        //     },
        //     token: "dWO0zArNRteMiuRpaiRQXo:APA91bHQ9CP7N0eIDqUqVMY49H3ycTW11-gl7vbq9D1jucWm_o7aLvFSZ4U2ugOE2F6uOVWDWWLU9IgkBkr5QLKWCDoIE7j0iwBvqwNKPVrwq4aqtBHLTnXVggoZLLaNKsZMgtlDqdsQ"
        // };
        
        

        // admin.messaging().send(message)
        // .then((response) => {
        //     // Response is a message ID string.
        //     console.log('Successfully sent message:', response);
        // })
        // .catch((error) => {
        //     console.log('Error sending message:', error);
        // });
        
        
        console.log(fcm_server_key)
        admin.messaging()
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/getFeed
// @desc   Get Feed For A User
// @access Private

const getFeed = async (req, res) => {
    try {
        const feed = await Feed.find({ toId: req.userId })
            .populate(
                {   
                    path: 'postId',
                    populate: {
                        path: 'userId',
                        select: '-password -notificationId'
                    }
                }
                )
        
        res.status(201).json({
            status: SUCCESS,
            message: FEED,
            data: {
                feed: feed
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/getFeed
// @desc   Get Feed For A User
// @access Private

const getNewFeed = async (req, res) => {
    try {
        const feed = await NewFeed.find({ userId: req.userId })
        .populate(
            {   
                path: 'postedByCompany',
            }
            ).populate({
                path: 'postedByUniversity',
            })

        return res.status(201).json({
            status: SUCCESS,
            message: NEW_FEED,
            data: {
                feed: feed
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// Get info about company

// @route  GET api/post/getMyFeed
// @desc   Get a user's feed
// @access Private
const getMyFeed = async(req, res) => {
    try {
        const myposts = await Posts.find({ userId: req.userId }).populate({ 
            path: 'userId', 
            select: '-password -notificationId' 
        })

        return res.status(202).json({
            status: SUCCESS,
            message: MY_FEED,
            data: {
                feed: myposts
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}


// @route  POST api/post/like/:id
// @desc   Like a Post
// @access Private

const likePost = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/dislike/:id
// @desc   Dislike a Post
// @access Private

const disLikePost = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/comment/:id
// @desc   Comment on a Post
// @access Private

const comment = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/comments
// @desc   Get All Comments of A Post
// @access Private

const getAllComments = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/comment/like/:id
// @desc   Like a Comment
// @access Private

const likeComment = (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/comment/dislike/:id
// @desc   Dislike a Comment
// @access Private

const disLikeComment = (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/hashtag/
// @desc   Create a New Hashtag
// @access Private

const createNewHashTag = (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/getAllPostsOfAHashTag/
// @desc   Get All Posts of a hashtag
// @access Private

const getAllPostsofHashTags = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}


// Post new opportunities by company

const postNewOpportunitiesCompany = async (req, res) => {
    try {
        const { postTitle, postContent, to } = req.body;

        console.log(typeof to)
        console.log(to)

        console.log(req.userId)

        const opportunity = new OpportunitiesByCompany({
            postTitle: postTitle,
            postContent: postContent,
            to: to,
            companyId: req.userId
        })
        
        await opportunity.save()

        for(const user of to) {
            console.log(user)
            const users = await User.find({ userType: user })

            if(users) {
                for(const u of users) {

                    console.log(opportunity.companyId)

                    const feed = new NewFeed({
                        feedTitle: postTitle,
                        feedContent: postContent,
                        postedByCompany: opportunity.companyId,
                        userId: u.id
                    })

                    await feed.save()
                }
            }
        }

        return res.status(201).json({
            status: SUCCESS,
            message: POSTED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}


const postNewOpportunitiesUniversity = async(req, res) => {
    try {
        const { postTitle, postContent, to } = req.body;

        console.log(req.userId)

        const opportunity = new OpportunitiesByUniversity({
            postTitle: postTitle,
            postContent: postContent,
            to: to,
            universityId: req.userId
        })
        
        await opportunity.save()

        for(const user of to) {
            console.log(user)
            const users = await User.find({ userType: user })

            if(users) {
                for(const u of users) {
                    const feed = new NewFeed({
                        feedTitle: postTitle,
                        feedContent: postContent,
                        postedByUniversity: opportunity.universityId,
                        userId: u.id
                    })

                    await feed.save()
                }
            }
        }

        return res.status(201).json({
            status: SUCCESS,
            message: POSTED,
            data: ''
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(fixedresponse);
    }
}

// @route  POST api/post/comment
// @desc   Add A New Comment to the post
// @access Private
const commentOnPost = async(req, res) => {
    try {
        const { content, postId } = req.body
        
        const post = await Posts.findById(postId)
            .populate({
                path: "userId",
                select: "-notificationId -password"
            })

        let user = await User.findOne({ userName: post.userId.userName })

        if(user) {
            const comment = new Comments({
                userId: req.userId,
                postId: postId,
                content: content
            })

            await comment.save()

            // LIKED , COMMENTED OR TAGGED
            const notification = new Notifications({
                userId: user.id, //Enter user id of other user over here,
                text: COMMENTED,
                postId: postId 
            }) 

            await notification.save()
        }

        if(user.notificationId) {
            const message = {
                to: user.notificationId,
                collapse_key: "collapse",
    
                notification: {
                  title: "Buzz Talk",
                  body: `${user.firstName} ${user.lastName} commented on your post`
                },
              };
            
            fcm.send(message, function (err, messageID) {
                if (err) {
                  console.log(err);
                  console.log("Something has gone wrong!");
                } else {
                  console.log("Sent with message ID: ", messageID);
                }
            });
        }

        return res.status(201).json({
            status: SUCCESS,
            message: COMMENTED,
            data: ''
        })

    } catch (error) {
        console.error(error)
        res.status(500).json(fixedresponse)
    }
}

// @route  POST api/post/getComments/:postId
// @desc   Get Comments of a Post
// @access Private
const getComments = async(req, res) => {
    try {
        const postId = req.params.postId 
        const comments = await Comments.find({ postId: postId }).populate({
            path: "userId",
            select: "-notificationId -password"
        })

        return res.status(201).json({
            status: SUCCESS,
            message: COMMENT,
            data: comments
        })
    } catch (error) {
        console.error(error)
        res.status(500).json(fixedresponse)
    }
}

export { 
    addPost, 
    getSinglePost, 
    getAllSpecificUsersPosts, 
    getFeed, 
    getNewFeed, 
    postNewOpportunitiesCompany, 
    postNewOpportunitiesUniversity,
    getMyFeed,
    commentOnPost,
    getComments
}
