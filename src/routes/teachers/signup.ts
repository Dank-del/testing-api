import { Request, Response } from "express";
import { hashIt } from "../../validation/password";
import { Teacher } from "../../models/teacher";
import { teacherSignUpSchema } from "../../validation/signup";
import { Student } from "../../models/students";

// sign up teachers
export const post = async (req: Request, res: Response) => {
    const data = teacherSignUpSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ message: JSON.parse(data.error.message)});
    }
    
    const existingTeacher = await Teacher.findOne({ email: data.data.email });
    const student = await Student.findOne({ email: data.data.email });
    if (student){
        return res.status(400).json({
            message: "You are a student",
        });
    }

    if (existingTeacher) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hashpwd = await hashIt(data.data.password);

    const teacher = new Teacher({
        name: data.data.name,
        email: data.data.email,
        password: hashpwd,
        age: data.data.age,
        subject: data.data.subject,
    });
    await teacher.save();
    return res.status(200).json({ message: 'Teacher created successfully', teacher: teacher.toJSON() });
}