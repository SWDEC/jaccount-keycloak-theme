/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260305.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/KcPage.tsx" --revert
 */

import { lazy } from "react";
import { KcAccountUiLoader } from "@keycloakify/keycloak-account-ui";
import type { KcContext } from "./KcContext";
import { KcContextEnv } from "./KcContextEnv";

const KcAccountUi = lazy(() => import("./KcAccountUi"));

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    return (
        <KcContextEnv.Provider value={kcContext}>
            <KcAccountUiLoader
                kcContext={kcContext}
                KcAccountUi={KcAccountUi}
                darkModePolicy="auto"
            />
        </KcContextEnv.Provider>
    );
}
