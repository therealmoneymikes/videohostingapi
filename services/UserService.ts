import bcrypt from "bcrypt";
import RedisClient from "../Redis/client";

/**
 * @description This the UserServices Module here we define
 * the business logic of the application.
 */

import UserModel, { IUser } from "../models/UserModel";

export class UserService {
  //Create User
  static async createUser(userData: IUser) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      //Hash password before saving it to the DB
      const existingUser = await UserModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("Email already exists");
      }
      //Create new document
      const user = new UserModel({
        ...userData,
        password: hashedPassword,
      });
      return await user.save();
    } catch (error) {
      console.error("Error create user: ", error);
      throw new Error("Unable to create user at this time.");
    }
  }

  //Retrieve User
  static async getUser(id: string) {
    try {
      const cacheKey = `user:${id}`;
      const cachedUserData = await RedisClient.get(cacheKey);

      if (cachedUserData) {
        //Parsing the stringified data in the cache to utilise
        return JSON.parse(cachedUserData);
      }

      //If no cache key is available we query the DB
      const user = await UserModel.findById(id);
      if (!user) {
        throw new Error(`User with ID: ${id} does not exist`);
      }
      return user;
    } catch (error) {
      console.error("Error retrieving user: ", error);
      throw new Error("Unable to retrieve user at this time.");
    }
  }

  //Update User Data
  static async updateUser(id: string, updatedUserData: IUser) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        { id },
        {
          $set: {
            ...updatedUserData,
          },
        },
        { runValidators: true, new: true }
      );

      if (!user) {
        throw new Error(`User with ID: ${id} does not exist`);
      }
    } catch (error) {
      console.error("Error updating user: ", error);
      throw new Error("Unable to update user at this time.");
    }
  }
  //User Service by Singular Field
  static async updateUserByField(id: string, field: string, value: any) {
    try {
      const updateDocumentObject = { [field]: value }; //index signature to choose the field
      const updatedUser = await UserModel.findOneAndUpdate(
        { id },
        { $set: updateDocumentObject },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        throw new Error(`User with ID: ${id} does not exist`);
      }
      return updatedUser;
    } catch (error) {
      console.error("Error updating user field: ", error);
      throw new Error("Unable to update user field at this time.");
    }
  }
  //User Service for Deleting  a User
  static async deleteUser(id: string) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete({ id });
      if (!deletedUser) {
        throw new Error(`User with ID: ${id} does not exist`);
      }

      return deletedUser;
    } catch (error) {
      console.error("Error deleting user: ", error);
      throw new Error("Unable to delete user at this time.");
    }
  }
}

export default UserService
