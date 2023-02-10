import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
    {
        organizationName: {
            type: String,
            required: true
        },
        organizationUserName: {
            type: String,
            required: true
        },
        organizationType: {
            type: String,
            required: true
        },
        organizationBio: {
            type: String,
            required: true
        },
        organizationImage: {
            type: String
        },
        organizationWebSite: {
            type: String,
            required: true
        },
        organizationPhone: {
            type: String,
            required: true
        },
        organizationEmail: {
            type: String,
            required: true
        },
        organizationPassword: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Organizations = mongoose.model('organizations', OrganizationSchema)
export default Organizations