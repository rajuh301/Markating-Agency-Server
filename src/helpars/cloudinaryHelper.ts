import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// 1. Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

});

// 2. Define the Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: { fieldname: string; originalname: string; }) => {
    // Determine folder based on field name
    let folderPath = 'invoice_app/others';
    if (file.fieldname === 'companyLogo') folderPath = 'invoice_app/logos';
    if (file.fieldname === 'signature') folderPath = 'invoice_app/signatures';

    return {
      folder: folderPath,
      allowed_formats: ['jpg', 'png', 'jpeg', 'svg'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

// 3. Create the Multer Upload Instance
export const CloudinaryUpload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export const CloudinaryProvider = cloudinary;