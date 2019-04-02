
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const sharp = require('sharp');
const Product = require('../models/Product');

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
  let url = req.body.url;
  let type = req.body.type;
  let id = req.body.id;
  console.log(url)
  if(type === 'logo'){
    await deleteFile(url.substring(url.search('logo')));
    await User.findOneAndUpdate({username: req.user.username},{ logoUrl: ''})
  } else if (type === 'product'){
    let product = await Product.findOneAndUpdate({_id: id},{imageUrl:''});
    await deleteFile(url.substring(url.search('productImage')));
  } else if(type === 'userPicture'){
    console.log('userPicture')
    await deleteFile(url.substring(url.search('userPicture')));
    await User.findOneAndUpdate({username: req.user.username},{ userPictureUrl: ''})
  }
  res.status(200).json({message:'Image deleted'})

})

// Define POST route
router.post('/upload', (request, response) => {
  const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      try {
        if (error) throw new Error(error);
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
            .resize(240,240)
            .toBuffer();

            fileName = `productImages/${request.user.username}/${timestamp}-${name}-${request.user.username}`;

          } else if(myType === 'logo'){
            sharpBuffer = await sharp(path)
            .resize(100, 100)
            .toBuffer();

            fileName = `logos/${request.user.username}/${timestamp}-${name}-${request.user.username}`;
          } else if(myType === 'userPicture'){
            sharpBuffer = await sharp(path)
            .resize(100, 100)
            .toBuffer();

            fileName = `userPictures/${request.user.username}/${timestamp}-${name}-${request.user.username}`;
          }

          data = await uploadFile(sharpBuffer, fileName, type);
         
        }
        return response.status(200).send(data);
      } catch (error) {
        console.log(error.message);
        return response.status(400).send(error);
      }
    });
});

module.exports = router;