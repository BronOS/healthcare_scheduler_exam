import useSwr from "swr";
import Container from "../components/container";
import React, {useEffect} from "react";
import Provider from "../components/provider";
import {HealthcareData} from "../interfaces/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Index() {
    const {data, error, isLoading} = useSwr<HealthcareData>("/api/providers", fetcher);
    const token = global?.window?.localStorage?.getItem("token") || null;

    if (error) return <div>Failed to load providers</div>;
    if (isLoading) return <div>Loading...</div>;
    if (!data) return null;

    function logout() {
        localStorage.removeItem("token");
        window.location.reload();
    }

    return (
        <>
            <Container>
                <div>
                    {token ? (
                        <div>
                            <h1>Welcome to the Healthcare Portal</h1>
                            <p>Click on a provider to schedule an appointment. <a href="#" onClick={logout}>Logout</a> <a href="/profile">Profile</a> </p>
                        </div>
                    ) : (
                        <div>
                            <h1>Welcome to the Healthcare Portal</h1>
                            <p>Please <a href="/login">log in</a> to schedule an appointment</p>
                        </div>
                    )}
                </div>
                <h1>Healthcare Providers</h1>
                {data.providers.map((provider) => (
                    <div key={provider.id}>
                        <Provider provider={provider}/>
                    </div>
                ))}
            </Container>
        </>
    );
}
