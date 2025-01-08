import bcrypt from "bcrypt"



/**
 * @description This the UserServices Module here we define
 * the business logic of the application. 
*/

import UserModel, { IUser } from "../models/UserModel";


export class UserServices {
    

    //Create User
    static async createUser(userData: IUser){
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10)
            //Hash password before saving it to the DB
            const existingUser = await UserModel.findOne({email: userData.email})
            if(existingUser){
                throw new Error("Email already exists")
            }
            //Create new document
            const user = new UserModel({
                ...userData,
                password: hashedPassword
            });
            return await user.save()
        } catch(error){
            console.error("Error create user: ", error);
            throw new Error("Unable to create user at this time.")
        }
    }

    //Retrieve User
    static async getUser(id: string){
        try {
            const cacheKey = `user:${id}`;
            
        } catch (error) {
            
        }
    }
}