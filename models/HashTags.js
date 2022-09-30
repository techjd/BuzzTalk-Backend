
import mongoose from 'mongoose';

const HashTagSchema = new mongoose.Schema(
    {
        hashtag : {
            type: String,
            required: true,
        },
        posts : [
            {
                post: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'posts',
                }
            }]
        },
        {
            timestamps: true,
        }
        );
        
        const User = mongoose.model('hashtags', HashTagSchema);
        export default User;