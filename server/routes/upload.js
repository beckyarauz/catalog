
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const sharp = require('sharp');

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

// Define POST route
router.post('/', (request, response) => {
  // console.log(request);
  const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path;
        const name = files.file[0].originalFilename;
        // console.log('POST test',files.file[0]);
        const buffer = fs.readFileSync(path);
        const type = fileType(buffer);
        const timestamp = Date.now().toString();
        let data; 

        if( type.ext ==='pdf' || name ==='pdf'){
          // console.log('document upload', type.ext);
          let fileName = `policies/${timestamp}-${name}-lg`;
          data = await uploadFile(buffer, fileName, type);
        } else if(type.ext === 'png' || type.ext === 'jpeg' || type.ext === 'jpg'){
          let sharpBuffer = await sharp(path)
                                .resize(100, 100)
                                .toBuffer();
          let fileName = `logos/${timestamp}-${name}-lg`;
          // console.log('image upload');
          data = await uploadFile(sharpBuffer, fileName, type);

          //save the data.Location to User.logo
        }
        return response.status(200).send(data);
      } catch (error) {
        console.log(error);
        return response.status(400).send(error);
      }
    });
});

module.exports = router;