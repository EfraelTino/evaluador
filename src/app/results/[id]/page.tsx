"use client";
import { useAuthStore } from "@/store/authStore";
import { AuthSession } from "@/types/auth";
import { useParams } from "next/navigation";
import React from "react";
export default function ResultsPage() {
    const session: AuthSession | null = useAuthStore((state) => state.session);
    console.log(session)
    const userid = session?.user?.id;
    console.log("user id: ", userid)
    const { id } = useParams();
    return (
        <section>
            {id}
        </section>
    );
}