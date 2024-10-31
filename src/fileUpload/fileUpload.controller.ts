import { Request, Response } from "express";
import { MulterFileUploadType } from "../users/user.types";
import { uploadOnCloudinary } from "../utils/cloudinary.util";

export class UploadFiles{
    private uploadedFiles:MulterFileUploadType[] =  [];

    async uploadUserFiles(req: Request, res: Response): Promise<void> {
        const files: MulterFileUploadType[] = [];
    
        if(Array.isArray(req.files)) files.push(...req?.files);
        else{
            res.status(422).json({
                statusCode: 422,
                message: "No files were uploaded"
            })
        }
    
        for(let singleFile of files){
            uploadOnCloudinary('./public/singleFile')
        }
    
    }
}