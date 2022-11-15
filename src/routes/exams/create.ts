import { Response } from 'express';
import { AuthorizedRequest } from '../../middlewares/jwt';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { Exam } from '../../models/exam';
import { Teacher } from '../../models/teacher';

export const post = [
    validateRequest({
        body: z.object({
            name: z.string().min(3).max(20),
            subject: z.string().min(3).max(20),
            afterMinutes: z.number().min(1).max(100),
            totalMarks: z.number().min(1),
            passingMarks: z.number().min(1),
        })
    }),
    async (req: AuthorizedRequest, res: Response) => {
        if (!req.teacher) {
            return res.status(400).json({ message: "Teacher not found" });
        }

        const { name, subject, afterMinutes, totalMarks, passingMarks } = req.body;
        const teacher = await Teacher.findOne({ email: req.teacher.email });
        const exam = new Exam({
            name: name,
            subject: subject,
            afterMinutes: Date.now() - afterMinutes,
            totalMarks: totalMarks,
            passingMarks: passingMarks,
            teacher: teacher?._id,
        });

        await exam.save();
        return res.status(200).json({ message: "Exam created successfully", exam: exam.toJSON() });
    }];