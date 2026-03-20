import { OrganizationInvitationRepresentation } from "@keycloak/keycloak-admin-client";
import { BaseEnvironment, KeycloakContext } from "../../shared/keycloak-ui-shared";
import { KcContext } from "../KcContext";
import { request } from "./orgs-sidecar-request";
import { parseResponse } from "./parse-response";
import { UserRepresentation } from "./representations";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import MemberRepresentation from "@keycloak/keycloak-admin-client/lib/defs/memberRepresentation";

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

export async function getOrganizationInvitations(
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
        `/organizations/${orgId}/invitations`,
        context,
        kcContext,
        {
            searchParams
        }
    );
    return parseResponse<OrganizationInvitationRepresentation[]>(response);
}

export async function getOrganizationGroups(
    context: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    orgId: string,
    first?: number,
    max?: number,
    briefRepresentation?: boolean
): Promise<UserRepresentation[]> {
    const searchParams: Record<string, string> = {};

    if (first != null) {
        searchParams.first = first.toString();
    }
    if (max != null) {
        searchParams.max = max.toString();
    }
    if (briefRepresentation != null) {
        searchParams.briefRepresentation = briefRepresentation.toString();
    }

    const response = await request(`/organizations/${orgId}/groups`, context, kcContext, {
        searchParams
    });
    return parseResponse<GroupRepresentation[]>(response);
}

export async function getOrganizationGroupMembers(
    context: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    orgId: string,
    groupId: string,
    first?: number,
    max?: number,
    briefRepresentation?: boolean
): Promise<MemberRepresentation[]> {
    const searchParams: Record<string, string> = {};

    if (first != null) {
        searchParams.first = first.toString();
    }
    if (max != null) {
        searchParams.max = max.toString();
    }
    if (briefRepresentation != null) {
        searchParams.briefRepresentation = briefRepresentation.toString();
    }

    const response = await request(
        `/organizations/${orgId}/groups/${groupId}/members`,
        context,
        kcContext,
        {
            searchParams
        }
    );
    return parseResponse<MemberRepresentation[]>(response);
}

export async function addGroupMember(
    context: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    orgId: string,
    groupId: string,
    userId: string
) {
    const response = await request(
        `/organizations/${orgId}/groups/${groupId}/members/${userId}`,
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

export async function removeGroupMember(
    context: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    orgId: string,
    groupId: string,
    userId: string
) {
    const response = await request(
        `/organizations/${orgId}/groups/${groupId}/members/${userId}`,
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

export async function addGroup(
    context: KeycloakContext<BaseEnvironment>,
    kcContext: KcContext,
    orgId: string,
    groupName: string
) {
    const response = await request(`/organizations/${orgId}/groups`, context, kcContext, {
        method: "PUT",
        body: { groupName }
    });

    if (!response.ok) {
        const { errors } = await response.json();
        throw errors;
    }

    return undefined;
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
