import { model, Schema } from "mongoose";
import { IStudent } from "./students";
import { ITeacher } from "./teacher";

// batch interface
export interface IBatch {
    name: string;
    students: IStudent[];
    teacher: ITeacher;
}

// batch schema
const batchSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "Student",
        },
    ],
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
    },
});

// batch model
export const Batch = model<IBatch>("Batch", batchSchema);