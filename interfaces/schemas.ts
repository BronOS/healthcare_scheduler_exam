import {array, enums, object, optional, string} from "superstruct";
import {Specialty} from "./types";

export const TimeSlotSchema = string();

export const CreateProviderSchema = object({
    id: optional(string()),
    facilityName: string(),
    doctorName: string(),
    specialty: enums(Object.values(Specialty)),
    availableHours: array(TimeSlotSchema),
});

// extend the CreateProviderSchema to include the id field
export const UpdateProviderSchema = object({
    id: string(),
    facilityName: optional(string()),
    doctorName: optional(string()),
    specialty: optional(enums(Object.values(Specialty))),
    availableHours: optional(array(TimeSlotSchema)),
});

export const CreateAppointmentSchema = object({
    providerId: string(),
    dateTime: string(),
});

export const UpdateAppointmentSchema = object({
    id: string(),
    dateTime: string(),
});

export const NewUserSchema = object({
    email: string(),
    name: string(),
    password: string(),
});

export const LoginUserSchema = object({
    email: string(),
    password: string(),
});
