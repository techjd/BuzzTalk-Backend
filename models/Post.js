
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        userID : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users',
        },
        imagesURL: [
            {
                url: {
                    type: String
                }
            }
        ],
        content: {
            type: String,
            required: true
        },
        taggedPersons: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
                }
            }
        ]
    },
    {
        timestamps: true,
    }
    );
    
    const User = mongoose.model('posts', PostSchema);
    
    export default User;