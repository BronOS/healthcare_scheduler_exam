import type {NextApiRequest, NextApiResponse} from "next";
import {Appointment, NewAppointment} from "../interfaces/types";
import {container} from "../inversify.config";
import {CreateAppointmentSchema} from "../interfaces/schemas";
import {is} from "superstruct";
import AppointmentScheduler from "./appointmentScheduler";
import {userSession} from "./userSession";

const scheduler = container.get<AppointmentScheduler>('AppointmentScheduler');

export default async function createAppointment(
    req: NextApiRequest,
    res: NextApiResponse<Appointment>,
) {
    const apt = req.body as NewAppointment;

    // transport layer validation
    if (!isValid(apt)) {
        return res.status(400).end('Appointment is invalid');
    }

    return scheduler.schedule(apt, await userSession(req)).then(apt => {
        return res.status(201).json(apt);
    }).catch(error => {
        console.error(error);
        return res.status(500).end('An error occurred while creating the appointment');
    });
}

function isValid(apt: NewAppointment): boolean {
    return is(apt, CreateAppointmentSchema);
}