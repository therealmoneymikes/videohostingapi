import mongoose, { Document, Schema, model } from "mongoose";
import cuid from "cuid";

enum UserRoles {
  USER = "user",
  ADMIN = "admin",
}

interface UserProfile {
  url: string;
  img?: string;
  alt?: string;
}

export interface IUser extends Document {
  id: string; //CUID's
  email: string;
  password: string;
  role: UserRoles;
  profile?: {
    bio: string;
    profileImg?: UserProfile;
    user: IUser["_id"];
  };
  generateAuthToken(): string; //Auth Token
}

//RegEx Validation for emails
const validateUserEmail = (email: string) => {
  const staffMemeberRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return staffMemeberRegExp.test(email);
};
const UserSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      default: cuid(),
      unique: true,
    },
    email: {
      type: String,
      minLength: [8, "Email must be at least 8 characters long"],
      maxlength: [255, "Email must be no more than 255 characters"],
      unique: true,
      validate: {
        validator: validateUserEmail,
      },
      password: {
        type: String,
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [255, "Passwrod must be no more than 255 characters"],
      },
      role: {
        type: String,
        enum: UserRoles,
        //Set the default to User and use the
        //.pre method to update it if needed
        default: UserRoles.USER,
      },
      //Set the type to an object to create query relationship
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile", //Here we are referencing the Profile model
      },
      createdAt: {type: Date, default: Date.now}
    },
  },
  {
    timestamps: true, //This enables use to createdAt and updatedAt fields
    //Enables virtual field (calculated fields that are not stored in the db)
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre("save", function (next) {
  //Check to see user email is the request body is company one or regular
  if (validateUserEmail(this.email)) {
    this.role = UserRoles.ADMIN;
  }
  //Move to the next request function in the RPP
  next();
});



UserSchema.virtual("userRoleKey").get(function () {
  return `${this.role}-${this.email}`;
  //"get" to access the values are create our custom data structures
});

//Settter (.set) we use this apply our calculated values to fields in the schema
UserSchema.virtual("userRoleKey").set(function (key) {
  //role and email...
  const [role, email] = key.split("-"); //Split at the -
  this.role = role; //assigns the role part of the string as the new role
  this.email = email; //assigns email part of the string as the new email
});

//NOTE: For the best performance key the virtual getters and setters simple
export default model<IUser>("User", UserSchema);
