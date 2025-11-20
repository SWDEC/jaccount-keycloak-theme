import { KeycloakContext } from "../../shared/keycloak-ui-shared";
import { BaseOrgSidecarBaseEnvironment, request } from "./orgs-sidecar-request";
import { parseResponse } from "./parse-response";
import { UserRepresentation } from "./representations";

export type CallOptions = {
    context: KeycloakContext<BaseOrgSidecarBaseEnvironment>;
    signal?: AbortSignal;
};

export async function getOrganizationMembers(
    orgId: string,
    { signal, context }: CallOptions
): Promise<UserRepresentation[]> {
    const response = await request(`/organizations/${orgId}/members`, context, {
        signal
    });
    return parseResponse<UserRepresentation[]>(response);
}

export async function inviteOrganizationMember(
    context: KeycloakContext<BaseOrgSidecarBaseEnvironment>,
    email: string,
    orgId: string
) {
    return request(`/organizations/${orgId}/members/invite`, context, {
        method: "POST",
        body: {
            email
        }
    });
}

export async function removeOrganizationMembers(
    context: KeycloakContext<BaseOrgSidecarBaseEnvironment>,
    userIds: string[],
    orgId: string
) {
    return request(`/organizations/${orgId}/members`, context, {
        method: "DELETE",
        body: {
            userIds,
            orgId
        }
    });
}
