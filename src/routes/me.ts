import { Response } from "express";
import { auth, AuthorizedRequest } from "../middlewares/jwt";

export const get = [auth, async (req: AuthorizedRequest, res: Response) => {
    if (req.student) {
        return res.status(200).json({ message: "Student found", student: req.student });
    }
    if (req.teacher) {
        return res.status(200).json({ message: "Teacher found", teacher: req.teacher });
    }
    return res.status(400).json({ message: "User not found" });
}];