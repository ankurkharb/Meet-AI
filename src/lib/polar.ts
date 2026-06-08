import { Polar } from "@polar-sh/sdk";

let polarClient: Polar | null = null;

export function getPolarClient(): Polar {
    const accessToken = process.env.POLAR_ACCESS_TOKEN;

    if (!accessToken) {
        throw new Error("POLAR_ACCESS_TOKEN is required to verify premium subscriptions.");
    }

    polarClient ??= new Polar({
        accessToken,
        // Use 'sandbox' for development, 'production' for live
        server: (process.env.POLAR_ENVIRONMENT as "sandbox" | "production") || "sandbox",
    });

    return polarClient;
}
