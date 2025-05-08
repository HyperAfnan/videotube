import {ApiError} from "../utils/apiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/fileUpload.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get deta from frontend
  // validation of data
  // check if user already exist: username, email
  // chekc for images and check for avatar
  // upload them to cloudinary,  avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const {fullname, email, username, password} = req.body;

  if (fullname === "") {
    throw new ApiError(400, "full name is required");
  }
  if (email === "") {
    throw new ApiError(400, "email is required");
  }
  if (username === "") {
    throw new ApiError(400, "user name is required");
  }
  if (password === "") {
    throw new ApiError(400, "password is required");
  }

  const existedUser = await User.findOne({$or: [{username}, {email}]});
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    password,
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (createUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User registered successfully "));
});

export {registerUser};
