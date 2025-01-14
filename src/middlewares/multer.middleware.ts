import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public')
    },
    filename: function (req, file, cb) {
      console.log(">>>file info: ", file)
      const uniqueSuffix = file?.originalname
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  export default upload;