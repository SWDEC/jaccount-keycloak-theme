/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            loginAccountTitle: "Sign in with jAccount"
        },
        de: {
            loginAccountTitle: "Mit jAccount anmelden",
            emailInstruction:
                "Gib deinen Benutzernamen oder deine E-Mail Adresse ein und klicke auf Absenden. Danach werden wir dir eine E-Mail mit weiteren Instruktionen zusenden.",
            emailSentMessage:
                "Du solltest in Kürze eine E-Mail mit weiteren Instruktionen erhalten.",
            emailSendErrorMessage:
                "Die E-Mail konnte nicht versendet werden. Bitte versuche es später noch einmal.",
            successLogout: "Du bist abgemeldet.",
            alreadyLoggedIn: "Du bist bereits angemeldet."
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
