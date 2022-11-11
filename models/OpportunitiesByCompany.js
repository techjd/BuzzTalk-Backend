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
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'companies',
            required: true
        }

},
{
    timestamps: true
})

const OpportunitiesByCompany = mongoose.model('companyopportunities', OpportunitiesSchema)
export default OpportunitiesByCompany