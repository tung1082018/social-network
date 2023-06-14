import User from "../models/user";
import { comparePassword, hashPassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const register = async (req, res) => {
  const { name, email, password, secret } = req.body;

  // validation
  if (!name) {
    return res.json({
      error: "Name is required",
    });
  }
  if (!password || password.length < 6) {
    return res.json({
      error: "Password is required and should be 6 characters long",
    });
  }
  if (!secret) {
    return res.json({
      error: "Answer is required",
    });
  }

  const exist = await User.findOne({ email });
  if (exist) {
    return res.json({
      error: "Email is taken",
    });
  }

  const hashedPassword = await hashPassword(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    secret,
    username: nanoid(6),
  });
  try {
    await user.save();
    console.log("Registered user", user);
    res.json({ ok: true });
  } catch (err) {
    console.log("Register failed", err);
    return res.json({
      error: "Something wrong. Try again.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if our db has user with that email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }

    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // token expires in 20 seconds (20 * 60)
    });

    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong. Try again.",
    });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    console.log("current user", user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const forgotPassword = async (req, res) => {
  const { email, newPassword, secret } = req.body;
  // validation
  if (!newPassword || newPassword.length < 6) {
    return res.json({
      error: "New password is required and should be min 6 characters long",
    });
  }
  if (!secret) {
    return res.json({
      error: "Secret is required",
    });
  }
  const user = await User.findOne({ email, secret });
  if (!user) {
    return res.json({
      error: "We can't verify you with those details",
    });
  }

  try {
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      success: "Congrats. Now you can login with your new password",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong. Try again.",
    });
  }
};

export const profileUpdate = async (req, res) => {
  try {
    const data = {};
    if (req.body.username) {
      data.username = req.body.username;
    }
    if (req.body.about) {
      data.about = req.body.about;
    }
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.json({
          error: "Password is required and should be min 6 characters long",
        });
      } else {
        data.password = await hashPassword(req.body.password);
      }
    }
    if (req.body.secret) {
      data.secret = req.body.secret;
    }
    if (req.body.image) {
      data.image = req.body.image;
    }
    const user = await User.findByIdAndUpdate(req.auth._id, data, {
      new: true,
    });
    user.password = undefined;
    user.secret = undefined;
    res.json(user);
  } catch (err) {
    // check duplicate error
    if (err.code === 11000) {
      res.json({
        error: "Duplicate username",
      });
    }
    console.log(err);
  }
};

export const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = user.following;
    following.push(user._id);
    const people = await User.find({ _id: { $nin: following } })
      .select("-password -secret")
      .limit(10);
    res.json(people);
  } catch (err) {
    console.log(err);
  }
};

export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.auth._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

export const userFollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = await User.find({ _id: { $in: user.following } })
      .select("-password -secret")
      .limit(100);
    res.json(following);
  } catch (err) {
    console.log(err);
  }
};

// removeFollower, userUnfollow
export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.auth._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

export const userUnfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const searchUser = async (req, res) => {
  const { query } = req.params;
  if (!query) return;
  try {
    // $regex is a special method from mongodb
    // The i modifier is used to perform case-insensitive matching.
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("-password -secret");
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -secret"
    );
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};
