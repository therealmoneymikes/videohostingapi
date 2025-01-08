import mongoose, { Document, model, ObjectId, Schema } from "mongoose";
import { IUser } from "./UserModel";
import cuid from "cuid";

export interface IVideo extends Document {
  id: string;
  title: String;
  description: string;
  url: string;
  genreId: ObjectId //Map GenreId to Genre Object for relationshio
}

const videoSchema = new Schema<IVideo>(
  {
    id: {
      type: String,
      default: cuid(),
      unique: true,
    },
    title: {
      type: String,
      minlength: [8, "Title must be at least 8 characters long"],
      maxlength: [255, "Title must be no more than 255 characters"],
      unique: true,
    },
    description: { type: String },
    url: { type: String, required: true },
    genreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true },}
);

export default model<IVideo>("Video", videoSchema)