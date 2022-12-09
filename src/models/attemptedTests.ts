import { model, Schema } from "mongoose";

export interface IAttemptedAnswer {
    questionId: string;
    optionId: string;
}

// attemptedTest interface
export interface IAttemptedTest {
    student: string;
    examId: string;
    answers: IAttemptedAnswer[];
}

// attemptedTest schema
const attemptedTestSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    examId: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    answers: [
        {
            questionId: {
                type: String,
                required: true,
            },
            optionId: {
                type: String,
                required: true,
            }
        },
    ],
});

export const AttemptedTest = model<IAttemptedTest>("AttemptedTest", attemptedTestSchema);