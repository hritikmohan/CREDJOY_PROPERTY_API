import express from 'express';
import { 
  createProperty, 
  getProperties, 
  bulkUploadProperties 
} from '../controllers/property.controller.js'; // Note .js extension
import upload from '../middleware/upload.middleware.js'; // Note .js extension

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(createProperty);

router.post('/bulk-upload', upload.single('file'), bulkUploadProperties);

export default router;