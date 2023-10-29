// const AWS = require('aws-sdk')
const { S3Client, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new S3Client({region:process.env.AWS_REGION})

const fileStorage = multerS3({
    s3,
    acl:"private",
    contentType:multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",
    bucket:process.env.S3_BUCKET,
    metadata:(req,file,cb) =>{
        cb(null, {fieldName:file.fieldname})
    },
    key: (req,file,cb) =>{
        const fileName = "images/" + new Date().getTime() + "-" + file.originalname
        cb(null,fileName)
    }
})

const uploadImageToS3 = multer({storage:fileStorage}).single("image")

const deleteImageFromS3 =async(req,res,next)=>{
    const Key = req.body.key
    const input = {
        Bucket:process.env.S3_BUCKET,
        Key
    }

    try{
        const command = new DeleteObjectCommand(input);
        await s3.send(command);
        next()
    }catch(err){
        console.log(err);
    }
}

const getImageFromS3 = async (req,res,next) =>{
    const Key = req.query.key
    const input = {
        Bucket:process.env.S3_BUCKET,
        Key
    }

    try{
        const command = new GetObjectCommand(input)
        const {Body} = await s3.send(command)

        req.imageBuffer = Body
        next()
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    uploadImageToS3,
    deleteImageFromS3,
    getImageFromS3
}