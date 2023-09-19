import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../schemas/usersMongo.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import envs from "../models/env.js";




const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, "Email in use");

  const hashPassword = await bcrypt.hash(password, 7);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    status: "OK",
    code: 201,
    email: newUser.email,
    subscription: newUser.subscription,
  });
};


const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!user || !passwordCompare) throw HttpError(401, "Email or password is wrong");

  const { _id: id } = user;
  const payload = { id };

  const token = jwt.sign(payload, envs.JWT_SECRET, { expiresIn: "23h" });

  await User.findByIdAndUpdate(id, { token });

  res.json({
    status: "OK",
    code: 200,
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    status: "OK",
    code: 200,
    email,
    subscription
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    status: "No Content",
    code: 204,
  });
};

const subscriptionUpdate = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  res.json(result);
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
};