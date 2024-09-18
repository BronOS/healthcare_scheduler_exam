import {Appointment, NewAppointment, UpdateAppointment} from "../interfaces/types";
import {v4 as uuidv4} from 'uuid';
import {promises as fs, readFileSync} from 'fs';
import {injectable} from "inversify";
import {Mutex} from "async-mutex";

export interface AppointmentsRepository {
    create(appointment: Appointment): Promise<Appointment>;

    update(appointment: Appointment): Promise<Appointment>;

    delete(id: string): Promise<void>;

    findById(id: string): Promise<Appointment | undefined>;

    findAllByUserEmail(userEmail: string): Promise<Appointment[]>;
}

@injectable()
export class FileAppointmentsRepository implements AppointmentsRepository {

    constructor(
        private readonly filePath: string,
        private readonly cache: Map<string, Appointment> = new Map(),
        private readonly mutex = new Mutex(),
    ) {
        // warm up the cache at startup
        this.load().forEach(provider => {
            this.cache.set(provider.id, provider);
        });
    }

    create(appointment: Appointment): Promise<Appointment> {
        return this.mutex.runExclusive(async () => {
            const id = uuidv4();
            const newAppointment = {...appointment, id};
            this.cache.set(newAppointment.id, newAppointment);
            await this.flush(Array.from(this.cache.values()));
            return newAppointment;
        });
    }

    delete(id: string): Promise<void> {
        return this.mutex.runExclusive(async () => {
            const appointment = this.cache.get(id);
            if (!appointment) {
                throw new Error(`Appointment with id ${id} not found`);
            }

            this.cache.delete(id);
            await this.flush(Array.from(this.cache.values()));
        });
    }

    findById(id: string): Promise<Appointment | undefined> {
        return this.mutex.runExclusive(async () => {
            return this.cache.get(id);
        });
    }

    findAllByUserEmail(userEmail: string): Promise<Appointment[]> {
        return this.mutex.runExclusive(async () => {
            return Array.from(this.cache.values()).filter(appointment => appointment.patientEmail === userEmail);
        });
    }

    update(appointment: Appointment): Promise<Appointment> {
        return this.mutex.runExclusive(async () => {
            const existingAppointment = this.cache.get(appointment.id);
            if (!existingAppointment) {
                throw new Error(`Appointment with id ${appointment.id} not found`);
            }

            const updatedAppointment = {...existingAppointment, ...appointment};
            this.cache.set(updatedAppointment.id, updatedAppointment);
            await this.flush(Array.from(this.cache.values()));
            return updatedAppointment;
        });
    }

    private load(): Appointment[] {
        return JSON.parse(readFileSync(this.filePath, 'utf-8'));
    }

    private flush(appointments: Appointment[]): Promise<void> {
        return fs.writeFile(this.filePath, JSON.stringify(appointments, null, 2));
    }
}