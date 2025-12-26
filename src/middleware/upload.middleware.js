import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.xlsx' && ext !== '.xls' && ext !== '.csv') {
    return cb(new Error('Only Excel or CSV files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;