const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const graveter = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../heplers");
const { error } = require("console");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = graveter.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      password: newUser.password,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30d" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscribtion: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const { path: tmpUpload, originalname } = req.file;

  const filename = `${_id}${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  // console.log(resultUpload);
  
  jimp
    .read(tmpUpload)
    .then((image) => {
      image.resize(250, 250).write(resultUpload);
    })
    .catch((err) => {
      throw HttpError(err);
    });

  // await Jimp.read(tem)

  await fs.rename(tmpUpload, resultUpload);

  const avatarURL = path.join("avatar", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

const authCtrl = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};

module.exports = {
  authCtrl,
};
