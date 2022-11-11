import mongoose, { Schema } from "mongoose";

const NewFeedSchema = new Schema({
        feedTitle: {
            type: String,
            required: true
        },
        feedContent: {
            type: String,
            required: true
        }, 
        postedByCompany: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'companies',
        },
        postedByUniversity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'universities'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }

},
{
    timestamps: true
})

const NewFeed = mongoose.model('newfeed', NewFeedSchema)
export default NewFeed