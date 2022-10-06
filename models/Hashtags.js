import mongoose, { Schema } from "mongoose";

const HashTagSchema = new mongoose.Schema(
    {
        hashTag: {
            type: String,
            required: true
        }
    }
)

const HashTags = mongoose.model('hashtags', HashTagSchema)
export default HashTags