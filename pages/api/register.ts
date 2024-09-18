import type {NextApiRequest, NextApiResponse} from "next";
import {UserSession} from "../../interfaces/types";
import newUser from "../../lib/newUser";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserSession>,
) {
    switch (req.method) {
        case "POST":
            newUser(req, res);
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
