import type {NextApiRequest, NextApiResponse} from "next";
import {HealthcareProvider} from "../../../interfaces/types";
import getProvider from "../../../lib/getProvider";
import deleteProvider from "../../../lib/deleteProvider";

export default function providerHandler(
    req: NextApiRequest,
    res: NextApiResponse<HealthcareProvider>,
) {
    switch (req.method) {
        case "GET":
            return getProvider(req, res);
        case "DELETE":
            return deleteProvider(req, res);
        default:
            res.setHeader("Allow", ["GET", "DELETE"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
