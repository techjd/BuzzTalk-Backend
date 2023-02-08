import express from 'express'
import multer from 'multer';
import { getImage, uploadImage } from '../controllers/imageController.js';
const imageRouter = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

imageRouter.post('/uploadImage', upload.single('image'), uploadImage)
imageRouter.get('/getImage', getImage)

export default imageRouter