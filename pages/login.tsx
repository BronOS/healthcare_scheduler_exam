import useSwr from "swr";
import Container from "../components/container";
import React, {useState} from "react";
import Provider from "../components/provider";
import {HealthcareData} from "../interfaces/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleFormSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    async function login(email: string, password: string) {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();
            // store token in local storage
            localStorage.setItem("token", data.token);
            // redirect to home page
            window.location.href = "/";
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <Container>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        Email:
                        <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div>
                        Password:
                        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div>
                        <button type="submit">Register</button>
                    </div>
                </form>
                <div>
                    <a href={"/register"}>Sign Up</a>
                </div>
            </Container>
        </>
    );
}
