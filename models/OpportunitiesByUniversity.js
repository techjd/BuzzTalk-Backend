import mongoose, { Schema } from "mongoose";

const OpportunitiesSchema = new Schema(
    {
        postTitle: {
            type: String,
            required: true
        }, 
        postContent: {
            type: String,
            required: true
        },
        to: [
            {
                type: String,
                required: true
            }
        ], 
        universityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'universities',
            required: true
        }

},
{
    timestamps: true
})

const OpportunitiesByUniversity = mongoose.model('universityoppo', OpportunitiesSchema)
export default OpportunitiesByUniversity