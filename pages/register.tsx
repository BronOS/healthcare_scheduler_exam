import Container from "../components/container";
import React from "react";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleFormSubmit = (e) => {
        e.preventDefault();
        register(email, password, name);
    };

    async function register(email: string, password: string, name: string) {
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: name,
                }),
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
                        Name:
                        <input type="text" name="email" onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div>
                        <button type="submit">Register</button>
                    </div>
                </form>
            </Container>
        </>
    );
}
