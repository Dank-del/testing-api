import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Teacher } from "../../models/teacher";

// write signin route
export const post = async (req: Request, res: Response) => {
    // get email and password from body
    const { email, password } = req.body;

    // check if email and password is provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password is required",
        });
    }

    // get user from database
    const user = await Teacher.findOne({ email });
    // check if email is wrong
    if (!user) {
        return res.status(400).json({
            message: "Email is wrong",
        });
    }

    // check if password is wrong
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: "Password is wrong",
        });
    }

    // create and send token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
    });
    res.status(200).json({
        message: "Successfully logged in",
        token,
    });
}