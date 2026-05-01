/**
 * Author: dev.slife
 * Date Created: 4/16/26
 * Date Updated: 4/19/26
 * Description:
 *      Handles all MinIO communication.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const minio = require('minio');
const express = require("express");
const router = express.Router();



// --------------------------- MINIO FUNCTIONS --------------------------- //

async function uploadPFP(userId, file) {
    const client = new minio.Client({
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: process.env.MINIO_USER,
        secretKey: process.env.MINIO_PASS
    });

    try {
        const bucketExists = await client.bucketExists(bucketName);
        if (!bucketExists) {
          await client.makeBucket(bucketName, 'us-east-1');
        }
    
        const ext = file.originalname.split('.').pop();
        const objectName = `pfp/${userId}.${ext}`;
    
        await client.putObject(
          bucketName,
          objectName,
          file.buffer,
          file.size,
          {
            'Content-Type': file.mimetype,
          }
        );
    
        return {
          bucketName,
          objectName,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    
    router.post('/pfp', upload.single('image'), async (req, res) => {
      try {
        const userId = req.body.userId; // or req.user.id if you have auth
        const file = req.file;
    
        if (!file) {
          return res.status(400).json({ message: 'No image uploaded' });
        }
    
        const result = await uploadPFP(userId, file);
    
        res.json({
          message: 'Profile picture uploaded successfully',
          ...result,
        });
      } catch (err) {
        res.status(500).json({ message: 'Upload failed', error: err.message });
      }
    });


// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;