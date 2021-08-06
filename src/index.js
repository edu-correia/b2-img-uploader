import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import express from 'express';
import cors from 'cors';
import { v2 as Cloudinary } from 'cloudinary'

Cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+'-'+file.originalname);
    }
})

const upload = multer({storage});

const app = express();

app.use(cors());

app.post('/upload/:bucketName', upload.single('file'), async (req, res) => {
    Cloudinary.uploader.upload(req.file.path, function(error, result) {
        return res.status(200).json(result.url);
    });
});

app.listen(process.env.PORT, () => console.log("Rodando..."));