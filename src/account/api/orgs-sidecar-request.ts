import { BaseEnvironment, KeycloakContext } from "../../shared/keycloak-ui-shared";
import { joinPath } from "../utils/joinPath";
import { RequestOptions, token } from "./request";
import { CONTENT_TYPE_HEADER, CONTENT_TYPE_JSON } from "./constants";
import { type KcContext } from "../KcContext";

async function _request(
    url: URL,
    { signal, getAccessToken, method, searchParams, body }: RequestOptions = {}
): Promise<Response> {
    if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) =>
            url.searchParams.set(key, value)
        );
    }

    return fetch(url, {
        signal,
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
            authorization: `Bearer ${await getAccessToken?.()}`
        }
    });
}

export const url = (environment: BaseEnvironment, kcContext: KcContext, path: string) =>
    new URL(
        joinPath(
            kcContext.properties.ORGS_SIDECAR_SERVER_URL,
            "admin",
            "realms",
            environment.realm,
            path
        )
    );

export async function request(
    path: string,
    { environment, keycloak }: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    opts: RequestOptions = {},
    fullUrl?: URL
) {
    if (typeof fullUrl === "undefined") {
        fullUrl = url(environment, kcContext, path);
    }
    return _request(fullUrl, {
        ...opts,
        getAccessToken: token(keycloak)
    });
}
