import {injectable} from "inversify";
import * as ar from "./appointmentsRepository";
import * as pr from "./providersRepository";
import * as ur from "./userRepository";
import {Appointment, NewAppointment, UpdateAppointment, User} from "../interfaces/types";

@injectable()
export default class AppointmentScheduler {

    constructor(
        private readonly appointmentsRepository: ar.AppointmentsRepository,
        private readonly providersRepository: pr.ProvidersRepository,
        private readonly usersRepository: ur.UserRepository,
    ) {
    }

    async schedule(appointment: NewAppointment, user?: User): Promise<Appointment> {
        // step 1: business logic validation (e.g. appointment time, provider availability, duplication, etc.)
        if (!await this.validateNewAppointment(appointment, user)) {
            throw new Error('Invalid appointment');
        }

        // step 2: prepare the appointment object
        const newAppointment: Appointment = {
            id: '',
            ...appointment,
            patientName: user?.id,
            patientEmail: user?.email,
        };

        // step 3: persist the appointment and return the result
        return this.appointmentsRepository.create(newAppointment);
    }

    async reschedule(appointment: UpdateAppointment, user: User): Promise<Appointment> {
        // step 1: try to get existing appointment
        const existingAppointment = await this.appointmentsRepository.findById(appointment.id);

        // step 2: business logic validation (e.g. appointment time, provider availability, duplication, etc.)
        if (!await this.validateUpdateAppointment(user, existingAppointment)) {
            throw new Error('Invalid appointment');
        }

        // step 3: prepare the appointment object
        const updatedAppointment: Appointment = {
            ...existingAppointment,
            dateTime: appointment.dateTime,
        };

        // step 4: persist the appointment and return the result
        return this.appointmentsRepository.update(updatedAppointment);
    }

    async cancel(appointmentId: string, user: User): Promise<void> {
        // step 1: business logic validation (e.g. appointment exists, user is the owner, etc.)
        if (!await this.validateCancelAppointment(appointmentId, user)) {
            throw new Error('Invalid appointment');
        }

        // step 2: delete the appointment
        return this.appointmentsRepository.delete(appointmentId);
    }

    private async validateNewAppointment(appointment: NewAppointment, user?: User): Promise<boolean> {
        // validate provider exists and time is available
        if (!await this.validateAppointmentTime(appointment.providerId, appointment.dateTime)) {
            return false;
        }

        // check duplication if user is provided
        if (user) {
            const existingAppointments = await this.appointmentsRepository.findAllByUserEmail(user.email);
            if (existingAppointments.some(a => a.dateTime === appointment.dateTime)) {
                return false;
            }
        }

        return true;
    }

    private async validateAppointmentTime(providerId: string, dateTime: string): Promise<boolean> {
        // validate provider exists
        const provider = await this.providersRepository.findById(providerId);
        if (!provider) {
            return false;
        }

        // validate provider's time availability
        return provider.availableHours.includes(dateTime);
    }

    private async validateUpdateAppointment(user: User, existingAppointment?: Appointment): Promise<boolean> {
        // step 1: validate appointment exists
        if (!existingAppointment) {
            return false;
        }

        // step 2: validate provider's time availability
        if (!await this.validateAppointmentTime(existingAppointment.providerId, existingAppointment.dateTime)) {
            return false;
        }

        // step 3: validate user is eligible to update this appointment
        //   - check if the user is set in the appointment
        //   - check if the user is the owner of the appointment
        return this.validateOwner(existingAppointment, user);
    }

    private validateOwner(appointment: Appointment, user: User): boolean {
        // validate user is eligible to update this appointment
        //   - check if the user is set in the appointment
        //   - check if the user is the owner of the appointment
        if (!appointment.patientEmail) {
            return false;
        }

        return appointment.patientEmail === user.email;
    }

    private async validateCancelAppointment(appointmentId: string, user: User): Promise<boolean> {
        // step 1: validate appointment exists
        const existingAppointment = await this.appointmentsRepository.findById(appointmentId);
        if (!existingAppointment) {
            return false;
        }

        // step 2: validate user is eligible to cancel this appointment
        return this.validateOwner(existingAppointment, user);
    }
}