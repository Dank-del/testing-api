import { model, Schema } from "mongoose";

// teacher interface
export interface ITeacher {
    _id: string;
    name: string;
    email: string;
    password: string;
    age: number;
    subject: string;
}

// teacher schema
const teacherSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
});

// teacher model
export const Teacher = model<ITeacher>("Teacher", teacherSchema);
