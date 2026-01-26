import { BaseEnvironment, KeycloakContext } from "../../shared/keycloak-ui-shared";
import { KcContext } from "../KcContext";
import { request } from "./orgs-sidecar-request";
import { parseResponse } from "./parse-response";
import { UserRepresentation } from "./representations";

export async function getOrganizationMembers(
    context: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    orgId: string,
    first?: number,
    max?: number
): Promise<UserRepresentation[]> {
    const searchParams: Record<string, string> = {};

    if (first != null) {
        searchParams.first = first.toString();
    }
    if (max != null) {
        searchParams.max = max.toString();
    }

    const response = await request(
        `/organizations/${orgId}/members`,
        context,
        kcContext,
        {
            searchParams
        }
    );
    return parseResponse<UserRepresentation[]>(response);
}

export async function inviteOrganizationMember(
    context: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    orgId: string,
    email: string
) {
    const response = await request(
        `/organizations/${orgId}/members/invite-user`,
        context,
        kcContext,
        {
            method: "POST",
            body: { email }
        }
    );

    if (!response.ok) {
        const { errors } = await response.json();
        throw errors;
    }

    return undefined;
}

export async function removeOrganizationMember(
    context: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    userId: string,
    orgId: string
) {
    const response = await request(
        `/organizations/${orgId}/members/${userId}`,
        context,
        kcContext,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        const { errors } = await response.json();
        throw errors;
    }

    return undefined;
}

export async function makeOrganizationManager(
    context: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    orgId: string,
    userId: string
) {
    const response = await request(
        `/organizations/${orgId}/managers/${userId}`,
        context,
        kcContext,
        {
            method: "PUT"
        }
    );

    if (!response.ok) {
        const { errors } = await response.json();
        throw errors;
    }

    return undefined;
}
