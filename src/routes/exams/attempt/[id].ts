import { Response } from "express";
import { auth, AuthorizedRequest } from "../../../middlewares/jwt";
import { Exam } from "../../../models/exam";
import _ from 'lodash';
import { AttemptedTest } from "../../../models/attemptedTests";

export const post = [
    auth,
    async (req: AuthorizedRequest, res: Response) => {
        if (!req.student) {
            return res.status(400).json({ message: `You are not a student` });
        }

        const { id } = req.params;
        const { questionId, optionId } = req.query;

        var exam = await Exam.findById(id);
        if (!exam) {
            return res.status(400).json({ message: "Exam not found" });
        }

        var attempt = await AttemptedTest.findOne({
            student: req.student._id,
        })

        if (!attempt) {
            attempt = new AttemptedTest({
                student: req.student._id,
                examId: id,
            });
        }

        if (questionId) {
            exam.questions.map((q) => {
                if (q.id === questionId) {
                    attempt?.answers.push({
                        questionId: q.id,
                        optionId: optionId as string,
                    })
                }
            });
            await attempt.save();
        }
        return res.status(200).json({ exam: exam.toJSON() });
    }]