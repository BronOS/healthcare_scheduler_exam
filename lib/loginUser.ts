import type {NextApiRequest, NextApiResponse} from "next";
import {LoginUser, UserSession} from "../interfaces/types";
import {container} from "../inversify.config";
import {LoginUserSchema} from "../interfaces/schemas";
import {is} from "superstruct";
import {UserRepository} from "./userRepository";
import AuthService from "./authService";

const userRepository = container.get<UserRepository>('UserRepository');
const authService = container.get<AuthService>('AuthService');

export default async function loginUser(
    req: NextApiRequest,
    res: NextApiResponse<UserSession>,
) {
    const loginUser = req.body as LoginUser;

    // transport layer validation
    if (!isValid(loginUser)) {
        return res.status(400).end('Bad Request');
    }

    // todo: refactoring: move this logic to the login service
    const user = await userRepository.findByEmail(loginUser.email);
    if (!user) { // check if user already exists
        return res.status(401).end('Unauthorized');
    }

    if (!await authService.comparePassword(loginUser.password, user.passwordHash)) {
        return res.status(401).end('Unauthorized');
    }

    // respond with user session
    const userSession: UserSession = {
        userId: user.id,
        token: await authService.generateToken(user),
    }

    return res.status(200).json(userSession);
}

function isValid(user: LoginUser): boolean {
    return is(user, LoginUserSchema);
}
