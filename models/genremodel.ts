import cuid from "cuid";
import { Document, model, Schema } from "mongoose";




export interface IGenre extends Document {
    id: string;
    name: string;
    description?: string;
}

const genreSchema = new Schema({
    id: {
        type: String,
        default: cuid(),
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    }
})

export default model<IGenre>("Genre", genreSchema)

