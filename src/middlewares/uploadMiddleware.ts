import multer from 'multer';

// Multer configuration to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

export default upload;
