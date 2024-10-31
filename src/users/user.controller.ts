import { Request, Response } from "express";
import { APIErrors } from "../utils/apiErrors";
import { UsersQuery } from "./user.query";
import { APIResponse } from "../utils/apiResponse";
import User from "./user.model";
import { RequestUserIDDTO, UserDTO } from "./user.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  private readonly usersQuery: UsersQuery = new UsersQuery();

  private async encryptPassword(password: string): Promise<string> {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  }

  private async validatePassword(
    userEnteredPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    const checkIfPasswordIsCorrect = await bcrypt.compare(
      userEnteredPassword,
      hashedPassword
    );

    if (checkIfPasswordIsCorrect) return true;
    return false;
  }

  private async checkUserExists(userName: string): Promise<boolean> {
    let doesUserExists;
    try {
      doesUserExists = await this.usersQuery.findAllUsers({ userName });
    } catch (error) {
      throw new APIErrors(422, "Unprocessable Entity");
    }

    if (doesUserExists) return true;

    return false;
  }

  private createUserDetailsToSend(
    userData: Partial<UserDTO>
  ): Partial<UserDTO> {
    return {
      id: userData?.id,
      username: userData?.username || "",
      email: userData?.email || "",
    };
  }

  private generateToken(
    id: number,
    refreshToken = false
  ): { [key: string]: string } {
    const tokenSecret = refreshToken
      ? process.env.REFRESH_TOKEN_SECRET
      : process.env.ACCESS_TOKEN_SECRET;
    const tokenExpiry = refreshToken
      ? process.env.REFRESH_TOKEN_EXPIRY
      : process.env.ACCESS_TOKEN_EXPIRY;
    const token = jwt.sign({ id }, tokenSecret as string, {
      expiresIn: tokenExpiry,
    });

    const responseKeyName = refreshToken ? "refreshToken" : "accessToken";
    return {
      [responseKeyName]: token,
    };
  }

  async createUser(req: Request, res: Response): Promise<void> {
    // create a user in Users table in MySQL.

    const { email, username, password }: { [key: string]: string } =
      req?.body || {};

    if ([email, username, password].some((item) => !item)) {
      throw new APIErrors(400, "Missing required fields");
    }

    /*
    check if users exists if user exists then throw error
    */
    const doesUserExists = await this.checkUserExists(username);

    if (doesUserExists)
      throw new APIErrors(400, "User already exists these details.");

    const encryptedPassword = await this.encryptPassword(password);

    let createUserDetails;
    try {
      createUserDetails = await this.usersQuery.createUser({
        email,
        username,
        password: encryptedPassword,
      });
    } catch (error) {
      throw new APIErrors(500, "Internal server error.");
    }

    const userDetailsRes = this.createUserDetailsToSend(createUserDetails);
    res
      .status(200)
      .json(new APIResponse(200, "User created successfully", userDetailsRes));
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const { username, password }: { [key: string]: string } = req?.body || {};

    if ([username, password].some((item) => !item)) {
      throw new APIErrors(400, "Missing required fields");
    }

    const user = await this.usersQuery.findOneUser({
      username,
    });

    if (!user) throw new APIErrors(400, "No user with this username exists.");

    const isPasswordCorrect = await this.validatePassword(
      password,
      user?.password
    );

    if (!isPasswordCorrect) throw new APIErrors(404, "Unauthorized Access!");

    const { accessToken } = this.generateToken(user?.id);
    const { refreshToken } = this.generateToken(user?.id, true);

    await this.usersQuery.upsertUserDetails({
      id: user?.id,
      refreshToken,
    });

    res
      .status(200)
      .json(
        new APIResponse(200, "Login Successfull", {
          accessToken,
          refreshToken,
        })
      )
      .cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: false,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: false,
      });
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    const { userID } = req.params || {};

    if (!userID || typeof userID !== "number") {
      throw new APIErrors(400, "No userID found");
    }

    const userDetails = await this.usersQuery.findOneUser({
      id: userID,
    });

    if (!userDetails) throw new APIErrors(500, "Internal Server Error");

    res.status(200).json(
      new APIResponse(200, "User details fetched successfully.", {
        userID: userDetails?.id,
        emailID: userDetails?.email,
        username: userDetails?.username,
      })
    );
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    const userID = (req as RequestUserIDDTO)?.userID;

    const updateUser = await this.usersQuery.upsertUserDetails({
      id: userID,
      refreshToken: null,
    });

    if (!updateUser) throw new APIErrors(500, "Internal Server Error");

    res
      .status(200)
      .json(new APIResponse(200, "User logged out successfully"))
      .clearCookie("accessToken")
      .clearCookie("refreshToken");
  }
}
