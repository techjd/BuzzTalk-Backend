import { fixedresponse } from "../utils/FailureResponse.js"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import crypto from 'crypto'

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: randomImageName(),
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        })

        await s3.send(command)

        res.json({ message: "Image Uploaded Successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse)
    }
}

const getImage = async(req, res) => {
    try {
        const getObjectParams = {
            Bucket: bucketName,
            Key: "c5880593c8834326fbb659e698c584499df8205a40cd75835c77cc2aacc0f219"
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        res.json({ url: url })
    } catch (error) {
        console.log(error)
        res.status(500).json(fixedresponse)
    }
}

export { uploadImage, getImage }