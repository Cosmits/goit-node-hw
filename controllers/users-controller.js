import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Jimp from 'jimp';
import gravatar from 'gravatar';

import User from '../schemas/usersMongo.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import sendEmail from '../helpers/sendEmail.js';

import path from 'path'
import fs from 'fs/promises';
import { v1 as uuidv1 } from 'uuid'

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const JWT_SECRET = process.env.JWT_SECRET
const BASE_URL = process.env.BASE_URL
const PORT = process.env.PORT

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, 'Email in use');

  const hashPassword = await bcrypt.hash(password, 7);
  const avatarURL = gravatar.url(email, { protocol: 'https' })
  const verificationToken = uuidv1();

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}:${PORT}/api/users/verify/${verificationToken}">Click to verify email</a>`
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    status: 'OK',
    code: 201,
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password)

  if (!user.verify) throw HttpError(401, "Email not verify"); // throw HttpError(401, "Email or password invalid");

  if (!user || !passwordCompare) throw HttpError(401, 'Email or password is wrong')

  const { _id: id } = user
  const payload = { id }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' })

  await User.findByIdAndUpdate(id, { token })

  res.json({
    status: 'OK',
    code: 200,
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  })
}

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user

  res.json({
    status: 'OK',
    code: 200,
    email,
    subscription
  })
}

const logout = async (req, res) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: '' })

  res.status(204).json({
    status: 'No Content',
    code: 204,
  })
}

const subscriptionUpdate = async (req, res) => {
  const { _id } = req.user
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  })

  res.status(200).json(result)
}

const avatarsDir = path.join('public', 'avatars')

const updateAvatarUser = async (req, res) => {
  const { _id } = req.user
  const { path: tempUpload, originalname } = req.file

  const filename = `${_id}_${originalname}`
  const resultUpload = path.join(avatarsDir, filename)

  await fs.rename(tempUpload, resultUpload)

  const resizeFile = await Jimp.read(resultUpload)
  await resizeFile.resize(250, 250).write(resultUpload)

  const avatarURL = path.join('avatars', filename)

  await User.findByIdAndUpdate(_id, { avatarURL })

  res.status(200).json({
    status: 'Update avatar',
    code: 200,
    avatarURL,
  })

}

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) throw HttpError(404);

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "Verify" });

  res.status(200).json({
    status: 'Verification successful',
    code: 200,
    message: "Email verification successful"
  })
}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(404, "email not found")

  if (user.verify) throw HttpError(400, "Email already verify")
  
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}:${PORT}/api/users/verify/${user.verificationToken}">Click to verify email</a>`
  };
  await sendEmail(verifyEmail);

  res.status(200).json({
    status: 'Verify email resend success',
    code: 200,
    message: "Verify email resend success"
  })
}


export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
  updateAvatarUser: ctrlWrapper(updateAvatarUser),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};