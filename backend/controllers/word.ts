import { Request, Response } from "express";
import { Word } from "../models/Word";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { v4 as uuid4 } from "uuid";
import sqlstring from "sqlstring";
import { config as dotenvConfig } from "dotenv";
dotenvConfig()

export async function createWord(req: Request, res: Response) {
  try {
    const { term, definitions, phonetic, meaning, examples } = req.body;

    if (!term || !definitions) {
      return res
        .status(400)
        .json({ error: "Missing required fields: term, definitions" });
    }

    const token = req.headers.authorization;
    console.log(token);
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

      const word = new Word();
      const uuid = uuid4();
      word.uuid = uuid;
      word.term = sqlstring.escape(term);
      word.phonetic = phonetic !== null ? sqlstring.escape(phonetic) : null;
      word.audio = sqlstring.escape(req.body.audio) || "";
      word.definitons = definitions.map((definition: string) =>
        sqlstring.escape(definition)
      );
      word.isGenerated = false;
      word.user = user;
      word.likedBy = [];
      word.dislikedBy = [];
      word.meaning = sqlstring.escape(meaning);
      word.examples = examples.map((example: string) =>
        sqlstring.escape(example)
      );
      word.synonyms = req.body.synonyms.map((synonym: string) =>
        sqlstring.escape(synonym)
      );
      word.antonyms = req.body.antonyms.map((antonym: string) =>
        sqlstring.escape(antonym)
      );

      await word.save();

      res.status(201).json(word);
    } catch (e) {
      res.send({ message: "Unauthorized", e });
    }
  } catch (error) {
    console.error("Error creating word:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteWord(req: Request, res: Response) {
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
      const userId = decodedToken.userId;
      const user = await User.findOne({ where: { uuid: userId } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const word = await Word.findOne({
        where: { uuid: wordId, user: { uuid: user.uuid } },
      });

      if (!word) {
        console.log(word);
        return res.status(404).json({ error: "Word not found" });
      }

      await word.remove();

      res.status(200).json({ message: "Word deleted successfully" });
    } catch (e) {
      res.send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error deleting word:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function editWord(req: Request, res: Response) {
  try {
    const { wordId } = req.params;
    const {
      term,
      definitions,
      audio,
      phonetic,
      meaning,
      examples,
      synonyms,
      antonyms,
    } = req.body;

    if (!wordId) {
      return res.status(400).json({ error: "Missing wordId parameter" });
    }

    if (
      !term &&
      !definitions &&
      audio === undefined &&
      !synonyms &&
      !antonyms &&
      !meaning &&
      !examples
    ) {
      return res.status(400).json({ error: "No fields to update" });
    }

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

      const word = await Word.findOne({
        where: { uuid: wordId, user: { uuid: user.uuid } },
      });

      if (!word) {
        return res.status(404).json({ error: "Word not found" });
      }

      if (term) {
        word.term = sqlstring.escape(term);
      }

      if (definitions) {
        word.definitons = definitions.map((definition: string) =>
          sqlstring.escape(definition)
        );
      }

      if (audio !== undefined) {
        word.audio = audio !== null ? sqlstring.escape(audio) : "NULL";
      }

      if (phonetic !== undefined) {
        word.phonetic = phonetic !== null ? sqlstring.escape(phonetic) : "NULL";
      }

      if (meaning) {
        word.meaning = sqlstring.escape(meaning);
      }

      if (examples) {
        word.examples = examples.map((example: string) =>
          sqlstring.escape(example)
        );
      }

      if (synonyms) {
        word.synonyms = synonyms.map((synonym: string) =>
          sqlstring.escape(synonym)
        );
      }

      if (antonyms) {
        word.antonyms = antonyms.map((antonym: string) =>
          sqlstring.escape(antonym)
        );
      }

      await word.save();

      res.status(200).json({ message: "Word updated successfully", word });
    } catch (e) {
      res.send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error editing word:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function searchWord(req: Request, res: Response) {
  try {
    const term = req.params.term;

    // Search in your database
    const results = await Word.find({ where: { term } });

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      // Word not found in the database, fetch from WordAPI as fallback
      const wordApiUrl = `https://wordsapiv1.p.rapidapi.com/words/${term}`;
      const response = await fetch(wordApiUrl, {
        headers: {
          'X-RapidAPI-Key': process.env.wordApi,
          'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
        },
      });

      if (!response.ok) {
        console.error(`Error fetching data for word ${term}: ${response.statusText}`);
        res.status(404).json({ error: 'Word not found' });
        return;
      }

      const data = await response.json();
      console.log(data)
      res.status(200).json(data);
    }
  } catch (error) {
    console.error("Error searching for word:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


