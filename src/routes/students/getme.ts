import { Response } from "express";
import { auth, AuthorizedRequest } from "../../middlewares/jwt";

export const get = [auth, async (req: AuthorizedRequest, res: Response) => {
    const student = req.student;
    if (!student) {
        return res.status(400).json({ message: "Student not found" });
    }
    return res.status(200).json({ message: "Student found", student: student });
}];