import { Request, Response } from "express";
import { Word } from "../models/Word";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

export async function likeWord(req: Request, res: Response) {
  try {
    const { wordId } = req.params;
    console.log(wordId)

    if (!wordId) {
      return res.status(400).json({ error: "Missing wordId parameter" });
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decodedToken: any = jwt.verify(token, process.env.jsonprivkey);
      const userId = decodedToken?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const word = await Word.findOne({ where: { uuid: wordId } });
      if (!word) {
        return res.status(404).json({ error: "Word not found" });
      }

      const likedIndex = word.likedBy.indexOf(userId);
      if (likedIndex !== -1) {
        // User has already liked the word, remove the like
        word.likedBy.splice(likedIndex, 1);
        word.likes -= 1;
        await word.save();

        return res.status(200).json({ message: "Like removed from user" });
      }

      // Check if the user has disliked the word
      const dislikedIndex = word.dislikedBy.indexOf(userId);
      if (dislikedIndex !== -1) {
        // User has disliked the word, remove the dislike
        word.dislikedBy.splice(dislikedIndex, 1);
        word.dislikes -= 1;
      }

      // User has not liked the word, add the like
      word.likedBy.push(userId);
      word.likes += 1;
      await word.save();

      res.status(200).json({ message: "Word liked successfully" });
    } catch (error) {
      console.error("Error liking word:", error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid token" });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error liking word:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function dislikeWord(req: Request, res: Response) {
  try {
    const { wordId } = req.params;

    if (!wordId) {
      return res.status(400).json({ error: "Missing wordId parameter" });
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decodedToken: any = jwt.verify(token, process.env.jsonprivkey);
      const userId = decodedToken?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const word = await Word.findOne({ where: { uuid: wordId } });
      if (!word) {
        return res.status(404).json({ error: "Word not found" });
      }

      const dislikedIndex = word.dislikedBy.indexOf(userId);
      if (dislikedIndex !== -1) {
        // User has already disliked the word, remove the dislike
        word.dislikedBy.splice(dislikedIndex, 1);
        word.dislikes -= 1;
        await word.save();

        return res.status(200).json({ message: "Dislike removed from user" });
      }

      // Check if the user has liked the word
      const likedIndex = word.likedBy.indexOf(userId);
      if (likedIndex !== -1) {
        // User has liked the word, remove the like
        word.likedBy.splice(likedIndex, 1);
        word.likes -= 1;
      }

      // User has not disliked the word, add the dislike
      word.dislikedBy.push(userId);
      word.dislikes += 1;
      await word.save();

      res.status(200).json({ message: "Word disliked successfully" });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid token" });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error("Error disliking word:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
