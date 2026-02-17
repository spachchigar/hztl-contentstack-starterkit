"use client";

import { getJstag } from "@/utils/lytics";
import { useEffect, useState } from "react";

export function useLytics() {
    const [jstag, setJstag] = useState<any>(null);

    useEffect(() => {
        setJstag(getJstag());
    }, []);

    return jstag;
}