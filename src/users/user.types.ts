import { Request } from "express";

export interface MulterFileUploadType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}


export interface UserDTO {
  id: number;
  email: string;
  username: string;
  password: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string;
  refreshToken: string | null;
}

export interface RequestUserIDDTO extends Request {
  userID: number;
}