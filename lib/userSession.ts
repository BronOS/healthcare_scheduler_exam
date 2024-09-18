import {NextApiRequest} from "next";
import {User} from "../interfaces/types";
import {container} from "../inversify.config";
import {UserRepository} from "./userRepository";
import {UserIDHeader} from "../middleware";

const userRepository = container.get<UserRepository>('UserRepository');

export async function userSession(req: NextApiRequest): Promise<User | undefined> {
    const userId = req.headers[UserIDHeader] as string;
    if (!userId) {
        return;
    }
    return userRepository.findById(userId);
}
