import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IStudent, Student } from "../models/students";
import { ITeacher, Teacher } from "../models/teacher";

export interface AuthorizedRequest extends Request {
    student?: IStudent | null;
    teacher?: ITeacher | null;
}

export const auth = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    // console.log(req.headers);
    // jwt middleware
    var token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
        token = req.cookies.token;
    }
    if (!token) token = req.body.token;
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const student = await Student.findOne({ _id: (decoded as JwtPayload).id });
        const teacher = await Teacher.findOne({ _id: (decoded as JwtPayload).id });
        req.student = student;
        req.teacher = teacher;
        next();
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}