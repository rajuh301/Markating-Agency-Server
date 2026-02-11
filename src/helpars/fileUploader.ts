import multer from "multer"
import path from "path"
import fs from 'fs'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })


// ------------------------------------
import { v2 as cloudinary } from 'cloudinary';
import { IFile } from "../app/interfaces/file"


// Configuration
cloudinary.config({
    cloud_name: 'dqtyqbfvd',
    api_key: '497614831392694',
    api_secret: 'CYgNockCn27VCeuaKiSm_IS6qng' // Click 'View API Keys' above to copy your API secret
});


const uploadToCloudinary = async (file: IFile) => {
    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(file.path, {
            public_id: file.originalname,
        }
        )
        .catch((error) => {
            console.log(error);
        });
    fs.unlinkSync(file.path)


    return uploadResult;
}



// ------------------------------------



export const fileUploader = {
    upload,
    uploadToCloudinary
};


