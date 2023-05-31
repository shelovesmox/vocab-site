import { Request, Response } from "express";
import { validationResult } from "express-validator";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/User";
import { config as dotenvConfig } from "dotenv";
import jwt from 'jsonwebtoken';
import { Word } from "../models/Word";
import sqlstring from "sqlstring";
dotenvConfig();

export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { email, username, password, firstname, lastname } = req.body;

  if (!email || !username || !password || !firstname || !lastname) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Remove single quotes from input values
  email = sqlstring.escape(email).replace(/'/g, '');
  username = sqlstring.escape(username).replace(/'/g, '');
  firstname = sqlstring.escape(firstname).replace(/'/g, '');
  lastname = sqlstring.escape(lastname).replace(/'/g, '');

  try {
    const existingUser = await User.findOne({ where: { username } });
    const existingEmail = await User.findOne({ where: { email } });

    if (existingUser || existingEmail) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await argon2.hash(password);

    const user = User.create();
    const uuid = uuidv4();
    user.uuid = uuid;
    user.email = email;
    user.username = username;
    user.password = hashedPassword;

    await user.save();

    const token = jwt.sign({ userId: user.uuid }, process.env.jsonprivkey, { expiresIn: "24h" });
    res.send({ token });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { email, password } = req.body;
  
  // Remove single quotes from input values
  email = sqlstring.escape(email).replace(/'/g, '');

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.uuid }, process.env.jsonprivkey, { expiresIn: "24h" });
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decodedToken: any = jwt.verify(token, process.env.jsonprivkey);
      const userId = decodedToken.userId;

      const user = await User.findOne({ where: { uuid: userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove single quotes from input values
      const sanitizedUserId = sqlstring.escape(userId).replace(/'/g, '');

      const words = await Word.find({ where: { user: { uuid: sanitizedUserId } } });

      if (words.length > 0) {
        await Word.remove(words);
      }

      await user.remove();

      res.status(200).json({ message: "User and associated words deleted successfully" });
    } catch (e) {
      res.send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error deleting user and words:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
