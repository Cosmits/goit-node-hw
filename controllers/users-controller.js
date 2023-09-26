import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Jimp from 'jimp';
import gravatar from 'gravatar';

import User from '../schemas/usersMongo.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import path from 'path'
import fs from 'fs/promises';

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const JWT_SECRET = process.env.JWT_SECRET

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, 'Email in use');

  const hashPassword = await bcrypt.hash(password, 7);
  const avatarURL = gravatar .url(email)
  
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

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

const avatarsDir = path.join( 'public', 'avatars')

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


export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
  updateAvatarUser: ctrlWrapper(updateAvatarUser),
};