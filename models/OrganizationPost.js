import mongoose, { Schema } from "mongoose";

const OrganizationPostSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'organizations',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        postsFor: [ {
                type: String,
                required: true
            }
        ],
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const OrganizationPost = mongoose.model('organizationposts', OrganizationPostSchema)
export default Posts