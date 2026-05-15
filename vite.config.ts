import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        keycloakify({
            accountThemeImplementation: "Single-Page",
            environmentVariables: [
                // Account console
                { name: "ORGS_SIDECAR_SERVER_URL", default: "http://localhost:3000" },
                // Login
                { name: "SHADCN_THEME_LAYOUT", default: "centered-card" },
                { name: "SHADCN_THEME_APP_NAME", default: "jAccount" },
                // The following variables are for fixing compile errors in @oussemasahbeni/keycloakify-login-shadcn:250004.0.21 only
                { name: "SHADCN_THEME_BASE", default: "neutral" },
                { name: "SHADCN_THEME_PRESET", default: "lime" },
                { name: "SHADCN_THEME_SIDE_IMAGE_URL", default: "" },
                { name: "SHADCN_THEME_FONT", default: "montserrat" },
                { name: "SHADCN_THEME_RADIUS", default: "normal" },
                { name: "SHADCN_THEME_PLACEHOLDER", default: "true" },
                { name: "SHADCN_THEME_LOGO_WHITE_URL", default: "" }, // we override the logo in the assets folder directly
                { name: "SHADCN_THEME_LOGO_DARK_URL", default: "" }, // we override the logo in the assets folder directly
            ],
            keycloakVersionTargets: {
                "22-to-25": false,
                "all-other-versions": true
            },
            groupId: "de.swdec.jaccount",
            startKeycloakOptions: {
                dockerImage: "quay.io/keycloak/keycloak:nightly" // nightly build because we need some functionality. Switch to stable once 26.7 is out.
            }
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    }
});
