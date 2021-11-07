import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
export async function generateHash(data: string, saltRound: string = process.env.SALT_ROUND) {
    return await hash(data, Number(saltRound));
}

export async function compareHash(data: string, hash: string) {
    return await compare(data, hash);
}

export function generateJwtToken(data: { email: string, userId: string, name: string }, jwtPrivateKey: string = process.env.JWT_PRIVATE_KEY, expiryTime: string = process.env.TOKEN_EXPIRY_TIME) {
    return sign(data, jwtPrivateKey, {
        expiresIn: Number(expiryTime)
    });
}
