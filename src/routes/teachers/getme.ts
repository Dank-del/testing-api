import { Response } from "express";
import { auth, AuthorizedRequest } from "../../middlewares/jwt";

export const get = [auth, async (req: AuthorizedRequest, res: Response) => {
    const teacher = req.teacher;
    if (!teacher) {
        return res.status(400).json({ message: "Teacher not found" });
    }
    return res.status(200).json({ message: "Teacher found", teacher: teacher });
}];