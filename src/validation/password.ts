import { genSalt, hash } from "bcrypt";

export async function hashIt(password: string) {
    const salt = await genSalt(6);
    const hashed = await hash(password, salt);
    return hashed;
}

