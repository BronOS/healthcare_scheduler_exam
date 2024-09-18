import type {NextApiRequest, NextApiResponse} from "next";
import {HealthcareProvider} from "../../../interfaces/types";
import createProvider from "../../../lib/createProvider";
import updateProvider from "../../../lib/updateProvider";

export default function modifyProviderHandler(
    req: NextApiRequest,
    res: NextApiResponse<HealthcareProvider>,
) {
    switch (req.method) {
        case "PUT":
            return createProvider(req, res);
        case "PATCH":
            return updateProvider(req, res);
        default:
            res.setHeader("Allow", ["PUT", "PATCH"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
