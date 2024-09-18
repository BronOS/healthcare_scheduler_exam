import type {NextApiRequest, NextApiResponse} from "next";
import {AppointmentData} from "../interfaces/types";
import {container} from "../inversify.config";
import {AppointmentsRepository} from "./appointmentsRepository";

const appointmentsRepository = container.get<AppointmentsRepository>('AppointmentsRepository');
// todo: inject auth service

export default async function listAppointments(
    req: NextApiRequest,
    res: NextApiResponse<AppointmentData>,
) {
    // todo: restrict access to authenticated users
    // todo: get user email from auth service
    const userEmail = ""

    return appointmentsRepository.findAllByUserEmail(userEmail).then(appointments => {
        // create a response object
        const data: AppointmentData = {appointments};
        // send the response
        return res.status(200).json(data);
    }).catch(error => {
        console.error(error);
        return res.status(500).end({appointments: [], error: 'An error occurred while fetching the appointments.'});
    })
}
