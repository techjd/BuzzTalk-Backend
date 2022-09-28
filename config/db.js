import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongo_uri, {
           useNewUrlParser: true,
           useUnifiedTopology: true
       })

       console.log('MongoDB Connected...')
    } catch (err) {
        console.log(err.message)
        // Exit process with failure
        process.exit(1)
    }
}

export default connectDB;