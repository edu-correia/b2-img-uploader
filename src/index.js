import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import express from 'express';
import Bucket from "backblaze";

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

app.post('/upload/:bucketName', upload.single('file'), async (req, res) => {
    const {bucketName} = req.query;
    const bucket = Bucket(bucketName, {
      id: process.env.B2_ID,
      key: process.env.B2_KEY
    });

    const file = await bucket.upload(req.file.path);

    return res.status(200).json(file.url);
});

app.listen(process.env.PORT, () => console.log("Rodando..."));