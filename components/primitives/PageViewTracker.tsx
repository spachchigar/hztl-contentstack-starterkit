"use client";

import { getJstag } from "@/utils/lytics";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PageViewTrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const jstag = getJstag();

        if (!jstag) return;

        jstag.pageView();
    }, [searchParams, pathname])

    return null;
}

export default function PageViewTracker() {


    return (
        <Suspense>
            <PageViewTrackerContent />
        </Suspense>
    );
}