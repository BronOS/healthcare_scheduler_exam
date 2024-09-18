import type {NextApiRequest, NextApiResponse} from "next";
import {Appointment} from "../../../interfaces/types";
import deleteAppointment from "../../../lib/deleteAppointment";

export default function modifyAppointmentHandler(
    req: NextApiRequest,
    res: NextApiResponse<Appointment>,
) {
    switch (req.method) {
        case "DELETE":
            return deleteAppointment(req, res);
        default:
            res.setHeader("Allow", ["DELETE"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
