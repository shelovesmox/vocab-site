import { Router, Response, Request } from "express";
import { register, login, deleteUser }from "../controllers/auth";




const authRouter: Router = Router()



authRouter.post("/register", (req: Request, res: Response) => {
    register(req, res);
})


authRouter.post("/login", (req: Request, res: Response) => {
    login(req, res);
})


authRouter.delete("/delete", (req: Request, res: Response) => {
    deleteUser(req, res);
})


export default authRouter;