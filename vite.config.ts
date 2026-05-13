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
            ],
            keycloakVersionTargets: {
                "22-to-25": false,
                "all-other-versions": true
            },
            groupId: "de.swdec.jaccount",
            startKeycloakOptions: {
                dockerImage: "quay.io/keycloak/keycloak:nightly" // nightly build because we need some functionality. Switch to stable once 26.6 is out.
            }
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    }
});
