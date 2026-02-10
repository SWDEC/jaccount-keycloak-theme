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
            welcomeMessage:
                "Welcome to your jAccount. One account for everything SWD-EC.",
            loginAccountTitle: "Login to your account",
            registerTitle: "Register a new account",
            email: "Email",
            enterCredentials: "Enter your credentials below to login",
            doRegister: "Sign up",
            noAccount: "Don't have an account?",
            "organization.selectTitle": "Choose Your Organization",
            "organization.select": "Choose Your Organization",
            "organization.pickPlaceholder": "Pick an organization to continue",
            doLogIn: "Sign in with jAccount",
            emailInstruction:
                "Enter your email and click on send. We will send you a mail with the next step.",
            "organization.member.register.title":
                "Create an account to join ${kc.org.name}"
        },
        de: {
            welcomeMessage:
                "Willkommen bei deinem jAccount. Ein Account für alles im SWD-EC.",
            loginAccountTitle: "Mit deinem jAccount einloggen",
            registerTitle: "Einen jAccount erstellen",
            email: "E-Mail",
            enterCredentials:
                "Entrez vos informations d'identification ci-dessous pour vous connecter",
            doRegister: "Registrieren",
            noAccount: "Noch keinen Account?",
            "organization.selectTitle": "Wähle eine Jugendarbeit",
            "organization.select":
                "Wähle die Jugendarbeit, über die du dich einloggen willst",
            "organization.pickPlaceholder":
                "Wähle die Jugendarbeit, über die du dich einloggen willst",
            doLogIn: "Mit jAccount anmelden",
            emailInstruction:
                "Gib deine E-Mail-Adresse ein und klicke auf Absenden. Dann schicken wir dir eine E-Mail mit dem nächsten Schritt.",
            "organization.member.register.title":
                "Erstelle ein Konto, um dem ${kc.org.name} beizutreten"
        }
    })
    .build();

export { I18nProvider, useI18n };
