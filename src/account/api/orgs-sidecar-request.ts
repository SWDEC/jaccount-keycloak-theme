import { BaseEnvironment, KeycloakContext } from "../../shared/keycloak-ui-shared";
import { joinPath } from "../utils/joinPath";
import { RequestOptions, token } from "./request";
import { CONTENT_TYPE_HEADER, CONTENT_TYPE_JSON } from "./constants";

export type BaseOrgSidecarBaseEnvironment = BaseEnvironment & {
    /**
     * The URL to the root of the Organizations Sidecar server, including the path if present.
     */
    sidecarServerBaseUrl: string;
};

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

export const url = (environment: BaseOrgSidecarBaseEnvironment, path: string) =>
    new URL(
        joinPath(
            environment.sidecarServerBaseUrl,
            "realms",
            environment.realm,
            "account",
            path
        )
    );

export async function request(
    path: string,
    { environment, keycloak }: KeycloakContext<BaseOrgSidecarBaseEnvironment>,
    opts: RequestOptions = {},
    fullUrl?: URL
) {
    if (typeof fullUrl === "undefined") {
        fullUrl = url(environment, path);
    }
    return _request(fullUrl, {
        ...opts,
        getAccessToken: token(keycloak)
    });
}
