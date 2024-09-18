import type {NextApiRequest, NextApiResponse} from "next";
import {UserSession} from "../interfaces/types";
import {container} from "../inversify.config";
import AuthService from "./authService";
import {userSession} from "./userSession";

const authService = container.get<AuthService>('AuthService');

export default async function refreshToken(
    req: NextApiRequest,
    res: NextApiResponse<UserSession>,
) {
    const user = await userSession(req);
    const newToken = await authService.generateToken(user);
    const session: UserSession = {
        userId: user.id,
        token: newToken,
    };
    return res.status(200).json(session);
}
