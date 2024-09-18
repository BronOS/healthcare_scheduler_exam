import {TimeSlot} from "../interfaces/types";
import {headers} from "next/headers";

type Props = {
    timeSlot: TimeSlot;
    providerId: string;
};

export default function ScheduleButton({timeSlot, providerId}: Props) {
    function handleClick() {
        const userToken = localStorage.getItem("token");
        const headers = {
            'Content-Type': 'application/json'
        };

        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        // send put request to /api/appointment
        fetch('/api/appointment', {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                providerId,
                dateTime: timeSlot,
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            alert('Appointment scheduled successfully. RefID: ' + data.id);
        }).catch(error => {
            console.error('There was an error scheduling the appointment:', error);
        });
    }

    return (
        <>
            <button key={timeSlot} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
                {timeSlot}
            </button>
        </>
    );
}