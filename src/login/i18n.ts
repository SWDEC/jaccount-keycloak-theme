/**
 * This file has been claimed for ownership from @oussemasahbeni/keycloakify-login-shadcn version 250004.0.15.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "login/i18n.ts" --revert
 */

import { i18nBuilder } from "@keycloakify/login-ui/i18n";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { I18nProvider, useI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            welcomeMessage: "Welcome to your SWD-EC jAccount.",
            loginAccountTitle: "Login to your account",
            registerTitle: "Register a new account",
            email: "Email",
            enterCredentials: "Enter your credentials below to login",
            noAccount: "Don't have an account?",
            doRegister: "Sign up",
            "organization.selectTitle": "Choose Your Organization",
            "organization.pickPlaceholder": "Pick an organization to continue"
        },
        de: {
            welcomeMessage: "Willkommen bei deinem SWD-EC jAccount.",
            loginAccountTitle: "Mit deinem jAccount einloggen",
            registerTitle: "Einen jAccount erstellen",
            email: "E-Mail",
            enterCredentials:
                "Entrez vos informations d'identification ci-dessous pour vous connecter",
            doRegister: "Registrieren",
            noAccount: "Noch keinen Account?",
            "organization.selectTitle": "Wähle eine Jugendarbeit",
            "organization.pickPlaceholder":
                "Wähle die Jugendarbeit, über die du dich einloggen willst"
        }
    })
    .build();

export { I18nProvider, useI18n };
