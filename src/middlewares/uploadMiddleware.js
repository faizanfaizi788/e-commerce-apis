// src/middlewares/uploadMiddleware.js
import multer from 'multer';

// Set up storage engine
const storage = multer.memoryStorage(); // Store files in memory (you can also use disk storage)

const upload = multer({ storage });

export default upload;
