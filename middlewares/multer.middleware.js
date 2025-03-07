import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads")
  },
  filename: function (req, file, cb) {
    const fileName = `${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, fileName)
  }
})

export const upload = multer({
  storage,
})