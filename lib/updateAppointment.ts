import type {NextApiRequest, NextApiResponse} from "next";
import {Appointment, UpdateAppointment} from "../interfaces/types";
import {container} from "../inversify.config";
import {UpdateAppointmentSchema} from "../interfaces/schemas";
import {is} from "superstruct";
import AppointmentScheduler from "./appointmentScheduler";
import {userSession} from "./userSession";

const scheduler = container.get<AppointmentScheduler>('AppointmentScheduler');

export default async function updateAppointment(
    req: NextApiRequest,
    res: NextApiResponse<Appointment>,
) {
    const apt = req.body as UpdateAppointment;

    // transport layer validation
    if (!isValid(apt)) {
        return res.status(400).end('Appointment is invalid');
    }

    const user = await userSession(req);

    return scheduler.reschedule(apt, user).then(apt => {
        return res.status(200).json(apt);
    }).catch(error => {
        console.error(error);
        return res.status(500).end('An error occurred while creating the appointment');
    });
}

function isValid(apt: UpdateAppointment): boolean {
    return is(apt, UpdateAppointmentSchema);
}