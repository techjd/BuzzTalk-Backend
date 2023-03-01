import { fixedresponse } from "../utils/FailureResponse.js"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import crypto from 'crypto'

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SUCCESS } from "../utils/Constants.js";

const bucketName = process.env.bucket_name
const bucketRegion = process.env.bucket_region
const accessKey = process.env.access_key
const secretAccessKey = process.env.secret_key

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    }
})

const uploadImage = async(req, res) => {
    try {
        let imageName = randomImageName()

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: imageName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        })

        await s3.send(command)

        res.json({ 
            status: SUCCESS,
            message: "Image Uploaded Successfully",
            data: imageName
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse)
    }
}

const getImage = async(req, res) => {
    try {
        const { imageName } = req.body
        console.log(imageName)

        const getObjectParams = {
            Bucket: bucketName,
            Key: imageName
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 36000 });
        
        console.log(url)
        console.log(typeof url)
        res.json({ 
            status: SUCCESS,
            message: 'IMAGE URL',
            data: url
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse)
    }
}

export { uploadImage, getImage }