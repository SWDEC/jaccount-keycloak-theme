/**
 * WARNING: Before modifying this file, run the following command:
 *
 * $ npx keycloakify own --path "login/components/Template/layouts/ImageAsideLayout.tsx"
 *
 * This file is provided by @oussemasahbeni/keycloakify-login-shadcn version 250004.0.21.
 * It was copied into your repository by the postinstall script: `keycloakify sync-extensions`.
 */

/* eslint-disable */

import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";
import authLogo from "../../../assets/img/auth-logo.svg";
import heroAnimation from "../../../assets/img/hero-animation.svg";
import { TemplateTopBar } from "../TemplateTopBar";

export function ImageAsideLayout(props: { content: ReactNode; imageUrl?: string }) {
    const { content } = props;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center px-2 py-12 md:p-10">
            <TemplateTopBar />
            <div className="p-0 w-full max-w-sm md:max-w-4xl flex flex-col gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <img
                        src={authLogo}
                        alt="SWD-EC Logo"
                        className="h-20 mx-auto dark:brightness-[1.2] dark:grayscale"
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="min-w-0 p-0 overflow-clip">
                        <CardContent className="p-0">{content}</CardContent>
                    </Card>

                    <div className="w-full h-full hidden md:flex flex-col justify-center items-center bg-muted rounded-(--radius)">
                        <img
                            src={heroAnimation}
                            alt="Authentication visual"
                            className="h-76 w-76 object-cover dark:brightness-[0.8]"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <p className="text-sm text-center text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-foreground">
                        SWD-EC ID – powered by Jesus
                        <br />
                        <a href="https://swdec.de/impressum" target="_blank">Impressum</a> •{" "}
                        <a href="https://swdec.de/datenschutz" target="_blank">Datenschutz</a> •{" "}
                        <a href="https://status.swdec.de" target="_blank">System-Status</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
