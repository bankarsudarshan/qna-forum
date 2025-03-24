const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function(err, buffer) {
            const fn = buffer.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        })
    }
});
const upload =  multer({ storage: storage });

// adds userId from req.user to req.body
const addUserToReqBody = (req, res, next) => {
    req.body.userId = req.user.id;
    next();
}

module.exports = {
    upload,
    addUserToReqBody,
}