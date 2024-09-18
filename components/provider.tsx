import {HealthcareProvider} from "../interfaces/types";
import ScheduleButton from "./schedule-button";

type Props = {
    provider: HealthcareProvider;
};

export default function Provider({provider}: Props) {
    return (
        <>
            <div>
                Facility Name: {provider.facilityName} - {provider.doctorName}
            </div>
            <div>
                Speciality: {provider.specialty}
            </div>
            <div>
                Available Hours:
                {provider.availableHours.map((timeSlot) => (
                    <ScheduleButton key={timeSlot} timeSlot={timeSlot} providerId={provider.id}/>
                ))}
            </div>
        </>
    );
}