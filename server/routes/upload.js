
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const sharp = require('sharp');

const User = require('../models/User');

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
const deleteFile = (name) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: name
  };
  return s3.deleteObject(params).promise();
};

router.post('/delete', async (req,res)=>{
  // console.log('pic url',req.body.url);
  let url = req.body.url;
  let type = req.body.type;
  if(type === 'logo'){
    // console.log('index', url.search('logo'));
    // console.log('substring', url.substring(url.search('logo')))

    await deleteFile(url.substring(url.search('logo')));

  
    await User.findOneAndUpdate({username: req.user.username},{ logoUrl: ''})
  } else if (type === 'product'){
    // console.log('hey')
    // console.log(url.substring(url.search('productImage')))
    await deleteFile(url.substring(url.search('productImage')));
    // await Product.findOneAndUpdate()
  }
  
  

  res.status(200).json({message:'Image deleted'})

})

// Define POST route
router.post('/', (request, response) => {
  
  const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      // console.log(fields);
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path;
        const name = files.file[0].originalFilename;
        const myType = fields.myType[0];        
        // console.log('POST test',files.file[0]);
        const buffer = fs.readFileSync(path);
        const type = fileType(buffer);
        const timestamp = Date.now().toString();
        let data; 
        let fileName;

        if( type.ext ==='pdf' || name ==='pdf'){
          // console.log('document upload', type.ext);
          fileName = `policies/${timestamp}-${name}-lg`;
          data = await uploadFile(buffer, fileName, type);
        } else if(type.ext === 'png' || type.ext === 'jpeg' || type.ext === 'jpg'){
          let sharpBuffer;
          if(myType === 'product'){
            sharpBuffer = await sharp(path)
            .resize(240,345)
            .toBuffer();

            fileName = `productImages/${timestamp}-${name}`;

          } else if(myType === 'logo'){
            sharpBuffer = await sharp(path)
            .resize(100, 100)
            .toBuffer();

            fileName = `logos/${timestamp}-${name}`;
          }

          data = await uploadFile(sharpBuffer, fileName, type);
         
        }
        return response.status(200).send(data);
      } catch (error) {
        console.log(error);
        return response.status(400).send(error);
      }
    });
});

module.exports = router;