import 'reflect-metadata';
import {Container} from 'inversify';
import {FileProvidersRepository, ProvidersRepository} from './lib/providersRepository';
import {AppointmentsRepository, FileAppointmentsRepository} from "./lib/appointmentsRepository";
import AppointmentScheduler from "./lib/appointmentScheduler";
import {FileUserRepository, UserRepository} from "./lib/userRepository";
import AuthService from "./lib/authService";

const container = new Container();

container.bind<ProvidersRepository>('ProvidersRepository').toDynamicValue(() => {
    return new FileProvidersRepository('./var/data/providers.json');
}).inSingletonScope();

container.bind<AppointmentsRepository>('AppointmentsRepository').toDynamicValue(() => {
    return new FileAppointmentsRepository('./var/data/appointments.json');
}).inSingletonScope();

container.bind<UserRepository>('UserRepository').toDynamicValue(() => {
    return new FileUserRepository('./var/data/users.json');
}).inSingletonScope();

container.bind<AppointmentScheduler>('AppointmentScheduler').toDynamicValue(() => {
    return new AppointmentScheduler(
        container.get<AppointmentsRepository>('AppointmentsRepository'),
        container.get<ProvidersRepository>('ProvidersRepository'),
        container.get<UserRepository>('UserRepository'),
    );
}).inSingletonScope();

container.bind<AuthService>('AuthService').toDynamicValue(() => {
    return new AuthService(
        process.env.JWT_SECRET || 'verysecret',
        parseInt(process.env.JWT_EXPIRATION || '60')
    );
}).inSingletonScope();

export {container};