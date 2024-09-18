import type {NextApiRequest, NextApiResponse} from "next";
import {Appointment, UpdateAppointment} from "../interfaces/types";
import {container} from "../inversify.config";
import {UpdateAppointmentSchema} from "../interfaces/schemas";
import {is} from "superstruct";
import AppointmentScheduler from "./appointmentScheduler";
import {userSession} from "./userSession";

const scheduler = container.get<AppointmentScheduler>('AppointmentScheduler');

export default async function deleteAppointment(
    req: NextApiRequest,
    res: NextApiResponse<Appointment>,
) {
    const user = await userSession(req);
    return scheduler.cancel(req.query.id as string, user).then(apt => {
        return res.status(204).end();
    }).catch(error => {
        console.error(error);
        return res.status(500).end('An error occurred while creating the appointment');
    });
}
