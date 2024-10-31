import { Request, RequestHandler, Response, Router } from "express";
import upload from "../middlewares/multer.middleware";
import { MulterFileUploadType } from "./user.types";
import { uploadOnCloudinary } from "../utils/cloudinary.util";
import { UserController } from "./user.controller";
import { verifyJWT } from "../middlewares/verifyJWT.middleware";

const router = Router();


const userControllerInstance = new UserController();


router.route("/createUser").post(userControllerInstance?.createUser?.bind(userControllerInstance));
router.route("/login").post(userControllerInstance?.loginUser?.bind(userControllerInstance));
router.route("/logout").post(userControllerInstance?.loginUser?.bind(userControllerInstance));
router.route("/getUser/:userID").get(verifyJWT as RequestHandler, userControllerInstance?.getUserDetails?.bind(userControllerInstance));
router.route("/logout").post(verifyJWT as RequestHandler, userControllerInstance.logoutUser?.bind(userControllerInstance));

router.route('').post(upload.array("files"), (req: Request, res: Response) => {
    const files: MulterFileUploadType[] = [];
    
    if(Array.isArray(req.files)) files.push(...req?.files);
    else{
        res.status(422).json({
            statusCode: 422,
            message: "No files were uploaded"
        })
    }
    
    console.log(">>>files: ", files)
    res.status(422).json({
        statusCode: 422,
        message: "No files were uploaded"
    })

    // for(let singleFile of files){
    //     uploadOnCloudinary('./public/singleFile')

    // }

})


export default router;