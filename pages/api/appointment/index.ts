import type {NextApiRequest, NextApiResponse} from "next";
import {Appointment} from "../../../interfaces/types";
import createAppointment from "../../../lib/createAppointment";
import updateAppointment from "../../../lib/updateAppointment";

export default function modifyAppointmentHandler(
    req: NextApiRequest,
    res: NextApiResponse<Appointment>,
) {
    switch (req.method) {
        case "PUT":
            return createAppointment(req, res);
        case "PATCH":
            return updateAppointment(req, res);
        default:
            res.setHeader("Allow", ["PUT", "PATCH"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
