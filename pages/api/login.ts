import type {NextApiRequest, NextApiResponse} from "next";
import {User, UserSession} from "../../interfaces/types";
import newUser from "../../lib/newUser";
import loginUser from "../../lib/loginUser";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserSession>,
) {
    switch (req.method) {
        case "POST":
            return loginUser(req, res);
        default:
            res.setHeader("Allow", ["POST"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
