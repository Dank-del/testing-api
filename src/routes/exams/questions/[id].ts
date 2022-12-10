import { Response } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { auth, AuthorizedRequest } from "../../../middlewares/jwt";
import { Exam } from "../../../models/exam";
import { IQuestion } from "../../../models/exam";
import { Teacher } from "../../../models/teacher";

export const put = [
    auth,
    validateRequest({
        body: z.object({
            examId: z.string().min(24),
            questionId: z.string().min(5),
            question: z.string().min(3),
            marks: z.number().min(1),
            options: z.array(
                z.object({
                    data: z.string().min(5),
                    isCorrect: z.boolean().default(false),
                })
            ),
        })
    }),
    async (req: AuthorizedRequest, res: Response) => {
        if (!req.teacher) {
            return res.status(400).json({ message: "Teacher not found" });
        }

        // get the exam and the question to be edited
        const exam = await Exam.findById(req.body.examId);
        if (!exam) {
            return res.status(400).json({ message: "Exam not found" });
        }

        const teacher = await Teacher.findOne({ email: req.teacher.email });
        if (exam.teacher.toString() !== teacher?._id.toString()) {
            return res.status(400).json({ message: "Invalid exam" });
        }

        const question = exam.questions.find((q: IQuestion) => q.id === req.body.questionId);
        if (!question) {
            return res.status(400).json({ message: "Question not found" });
        }

        // calculate total marks from the existing questions
        let totalMarks = 0;
        exam.questions.forEach((q: IQuestion) => {
            totalMarks += q.marks;
        });

        // subtract the marks of the question being edited from the total
        totalMarks -= question.marks;

        // check if the updated question's marks will exceed the total marks for the exam
        if (totalMarks + req.body.marks > exam.totalMarks) {
            return res.status(400).json({ message: "Total marks exceeded" });
        }

        // update the question fields
        question.question = req.body.question;
        question.marks = req.body.marks;
        question.options = req.body.options;

        // save the exam in the database
        await exam.save();
        return res.status(200).json({ message: "Question updated successfully", exam: exam.toJSON() });
    }
]

export const del = [
    auth,
    validateRequest({
        body: z.object({
            examId: z.string().min(24),
            questionId: z.string().min(5),
        })
    }),
    async (req: AuthorizedRequest, res: Response) => {
        if (!req.teacher) {
            return res.status(400).json({ message: "Teacher not found" });
        }

        // get the exam and the question to be deleted
        const exam = await Exam.findById(req.body.examId);
        if (!exam) {
            return res.status(400).json({ message: "Exam not found" });
        }

        const teacher = await Teacher.findOne({ email: req.teacher.email });
        if (exam.teacher.toString() !== teacher?._id.toString()) {
            return res.status(400).json({ message: "Invalid exam" });
        }

        // find the index of the question to be deleted
        const questionIndex = exam.questions.findIndex((q: IQuestion) => q.id === req.body.questionId);
        if (questionIndex === -1) {
            return res.status(400).json({ message: "Question not found" });
        }

        // remove the question from the exam's list of questions
        exam.questions.splice(questionIndex, 1);

        // save the exam in the database
        await exam.save();
        return res.status(200).json({ message: "Question deleted successfully", exam: exam.toJSON() });
    }
]