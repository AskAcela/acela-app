"use client";

import { useRouter } from "next/navigation";

export function useNewChat() {
    const router = useRouter();

    function createNewChat() {
        router.push("/");
        router.refresh();
    }

    return createNewChat;
}
