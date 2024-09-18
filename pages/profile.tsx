import Container from "../components/container";
import React, {useEffect, useState} from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Login() {
    if(typeof window !== 'undefined') {
        const token = localStorage.getItem("token") || null;

        if (!token) {
            window.location.href = "/login";
        }
    }

    return (
        <>
            <Container>
                PROFILE
            </Container>
        </>
    );
}
