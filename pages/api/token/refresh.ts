import type {NextApiRequest, NextApiResponse} from "next";
import {UserSession} from "../../../interfaces/types";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserSession>,
) {
    switch (req.method) {
        case "PATCH":
            // todo: refresh the token
            break;
        default:
            res.setHeader("Allow", ["PATCH"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
