import { Router, Response, Request } from "express";
import { createWord, deleteWord, editWord, searchWord } from "../controllers/word";

// todo: change file name to word and change routes

const wordRouter: Router = Router()



wordRouter.post("/", (req: Request, res: Response) => {
   
})


wordRouter.post("/words/create", (req: Request, res: Response) => {
    createWord(req, res);
})

wordRouter.delete("/words/:wordId", (req: Request, res: Response) => {
    deleteWord(req, res);
})

wordRouter.put("/words/:wordId", (req: Request, res: Response) => {
    editWord(req, res);
})

wordRouter.get("/search/:term", (req: Request, res: Response) => {
    searchWord(req, res)
});


export default wordRouter;