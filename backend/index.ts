import express, { Express, Request, Response } from "express";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Word } from "./models/Word";
import authRouter  from './routes/auth'
import passport from "passport";
import session from 'express-session';
import wordRouter from "./routes/words";
import { config as dotenvConfig } from "dotenv";
import likesRouter from "./routes/likes";
import cors from 'cors';
dotenvConfig();

// todo: change defRouter to wordRouter


const secret = process.env.sessionSecret
const dbuser = process.env.dbusername
const dbpass = process.env.dbpassword
const dbname = process.env.dbname


const app: Express = express();
app.use(cors())
app.use(express.json());
app.use('/auth/v1', authRouter)
app.use('/api/v1/', wordRouter)
app.use('/api/v1/activity', likesRouter)

app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 20
        }
    })
)
app.use(passport.initialize());;
app.use(passport.session())





const port: number = 8080;
const AppSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: dbuser,
  password: dbpass,
  database: dbname,
  entities: [User, Word],
  synchronize: true,
});


(async function () {
  const source = await AppSource.initialize();
})();


app.get("/", (req: Request, res: Response) => {
    console.log(req.session)
  res.send("hey");
});

app.listen(port, () => {
  console.log(
    `⚡ [server]: Server has been initialized, running on port ${port}`
  );
});``
