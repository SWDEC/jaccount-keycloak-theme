import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            accountThemeImplementation: "Single-Page",
            environmentVariables: [
                { name: "ORGS_SIDECAR_SERVER_URL", default: "http://localhost:3000"}
            ],
            groupId: "de.swdec.jaccount"
        })
    ]
});
