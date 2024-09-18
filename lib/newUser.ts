import type {NextApiRequest, NextApiResponse} from "next";
import {NewUser, User, UserSession} from "../interfaces/types";
import {container} from "../inversify.config";
import {NewUserSchema} from "../interfaces/schemas";
import {is} from "superstruct";
import {UserRepository} from "./userRepository";
import AuthService from "./authService";

const userRepository = container.get<UserRepository>('UserRepository');
const authService = container.get<AuthService>('AuthService');

export default async function newUser(
    req: NextApiRequest,
    res: NextApiResponse<UserSession>,
) {
    const newUser = req.body as NewUser;

    // transport layer validation
    if (!isValid(newUser)) {
        return res.status(400).end('User is invalid');
    }

    // todo: refactoring: move this logic to the registration service
    if (await userRepository.findByEmail(newUser.email)) { // check if user already exists
        return res.status(400).end('User with this email already exists');
    }
    const user: User = { // prepare the user for storage
        id: '',
        email: newUser.email,
        passwordHash: await authService.hashPassword(newUser.password),
        name: newUser.name,
    }

    return userRepository.create(user).then(async user => {
        // prepare the user session
        const userSession: UserSession = {
            userId: user.id,
            token: await authService.generateToken(user),
        }
        return res.status(200).json(userSession);
    }).catch(error => {
        console.error(error);
        return res.status(500).end('An error occurred while creating the user');
    });
}

function isValid(user: NewUser): boolean {
    return is(user, NewUserSchema);
}
