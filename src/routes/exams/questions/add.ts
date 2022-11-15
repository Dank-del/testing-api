import { Response } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { AuthorizedRequest } from "../../../middlewares/jwt";
import { Exam } from "../../../models/exam";
import { IQuestion } from "../../../models/exam";
import { v4 as uuiv4 } from "uuid";

export const post = [
    validateRequest({
        body: z.object({
            examId: z.string().min(5),
            question: z.string().min(3),
            options: z.array(
                z.object({
                    data: z.string().min(5),
                    isCorrect: z.boolean().default(false),
                })
            ),
        }).strict()
    }),
    async (req: AuthorizedRequest, res: Response) => {
        if (!req.teacher) {
            return res.status(400).json({ message: "Teacher not found" });
        }

        const { examId, question, options } = req.body;
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(400).json({ message: "Exam not found" });
        }

        const q: IQuestion = {
            id: uuiv4().toString(),
            question: question,
            options: options,
        };

        await exam.questions.push(q);
        await exam.save();
        return res.status(200).json({ message: "Question added successfully", exam: exam.toJSON() });
    }
]