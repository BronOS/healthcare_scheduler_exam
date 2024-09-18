import type {NextApiRequest, NextApiResponse} from "next";
import {AppointmentData} from "../../interfaces/types";
import listAppointments from "../../lib/listAppointments";

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse<AppointmentData>,
) {
    switch (_req.method) {
        case "GET":
            return listAppointments(_req, res);
        default:
            res.setHeader("Allow", ["GET"]);
            return res.status(405).end(`Method ${_req.method} Not Allowed`);
    }
}
