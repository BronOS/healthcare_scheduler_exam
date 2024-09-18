import type {NextApiRequest, NextApiResponse} from "next";
import {HealthcareData} from "../../interfaces/types";
import listProviders from "../../lib/listProviders";

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse<HealthcareData>,
) {
    switch (_req.method) {
        case "GET":
            return listProviders(_req, res);
        default:
            res.setHeader("Allow", ["GET"]);
            return res.status(405).end(`Method ${_req.method} Not Allowed`);
    }
}
