import * as bcrypt from "bcrypt";

export class BcryptUtil {
    static async hashPassword(password: string, saltRounds: number = 10): Promise<string> {
        return await bcrypt.hash(password, saltRounds);
    }

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
