"use client";

import SystemErrorFallback from "@/components/system/SystemErrorFallback";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return <SystemErrorFallback theme="light" error={error} reset={reset} />;
}
