import {UserService} from "../services/UserService"
import { NextFunction, Request, Response } from "express"
import RedisClient from "../Redis/client"

/**
 *
 * @param req The user request received in either the body or the params
 * @param res The api response received afte the request
 * @param next The next function to pass control to the next function in
 *             the request processing pipeline
 *
 * @description The User Controller layer is response for handling
 *              the HTTP request and responses. It calls the
 *              needed services to process a request and then return the response
 */



export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.log("Error:", error);
    next(error)
  }
};


//User Log In Controller
export const userLoginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {username, token} = req.body;

    try{
        if(!username || !token){
            res.status(400).json({error: "Missing username or token"})
        }
        //Store the login session with my redis client
        await RedisClient.set(`session:${username}`, token);
        res.json({message: "User has logged in successfully"})

    } catch (error) {
        console.error("Error:", error) //Pass the error to the next func to handle
        next()
    }
}

export const userLogoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;

  try {
    //Deleting user from the cache
    const deleteResult = await RedisClient.del(`session:${username}`);
    if (deleteResult === 0) {
      //0 mean there is no value, 1 means there is
      res.status(404).json({ error: "User Session not found" });
    }

    res.json({message: "User logged out successfully"})
  } catch (error) {
    console.error("Error:", error);
    next(error)
  }

  //if delete is successful
  res.json({
    message: "User logged out succesfully",
  });

}

//get User Session by the Username
export const getUserSessionByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;

  try {
    //the `session:${username}` is quite repeative ideally this should be
    //stored in config file and reused across our codebase
    const sessionToken = await RedisClient.get(`session:${username}`);
    if (!sessionToken) {
      res.status(404).json({ error: "User Session not found" });
    }
    res.json({ data: { username }, token: sessionToken });
  } catch (error) {
    next(error);
  }
};
