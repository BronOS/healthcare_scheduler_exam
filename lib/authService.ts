import bcrypt from 'bcryptjs';
import {jwtVerify, SignJWT} from "jose";
import {UserJwtPayload} from "../interfaces/types";

export default class AuthService {
    constructor(
        private readonly secret: string,
        private readonly expiration: number,
    ) {
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async generateToken(user: { id: string; email: string }): Promise<string> {
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + 60 * this.expiration; // one hour

        return  new SignJWT({...{id: user.id, email: user.email}})
            .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(new TextEncoder().encode(this.secret));
    }

    async verifyToken(token: string): Promise<UserJwtPayload> {
        const verified = await jwtVerify(token, new TextEncoder().encode(this.secret));
        return {
            id: verified.payload.id,
            email: verified.payload.email,
        } as UserJwtPayload;
    }
}