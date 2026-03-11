import { getKcContext } from "@/account/KcContext";
import { BaseEnvironment, useAlerts, useEnvironment } from "@/shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { InviteMemberModal } from "../members/InviteMemberModal";
import {
    ErrorBoundaryFallback,
    ErrorBoundaryProvider,
    KeycloakDataTable
} from "@/shared/keycloak-ui-shared";
import { Button, ToolbarItem } from "@patternfly/react-core";
import { getOrganizationInvitations } from "@/account/api/orgs-sidecar-methods";
import { AccessDeniedState } from "../AccessDeniedState";
import { useState } from "react";
import { OrganizationInvitationRepresentation } from "@keycloak/keycloak-admin-client";

interface InvitationsProps {
    orgId: string;
}

export const Invitations = ({ orgId }: InvitationsProps) => {
    const { t } = useTranslation();
    const context = useEnvironment<BaseEnvironment>();
    const { kcContext } = getKcContext();
    const { addError, addAlert } = useAlerts();

    const [key, setKey] = useState(0);
    const refresh = () => setKey(key + 1);

    const [openInviteMembers, setInviteMembers] = useState(false);
    const toggleInviteMembers = () => {
        setInviteMembers(!openInviteMembers);
        refresh();
    };

    const loader = async (first?: number, max?: number) => {
        return await getOrganizationInvitations(context, kcContext, orgId, first, max);
    };

    return (
        <>
            {openInviteMembers && (
                <InviteMemberModal orgId={orgId} onClose={toggleInviteMembers} />
            )}
            <ErrorBoundaryProvider>
                <ErrorBoundaryFallback fallback={AccessDeniedState}>
                    <KeycloakDataTable
                        key={key}
                        loader={loader}
                        ariaLabelKey="invitationsList"
                        toolbarItem={
                            <ToolbarItem>
                                <Button variant="primary" onClick={toggleInviteMembers}>
                                    {t("inviteMember")}
                                </Button>
                            </ToolbarItem>
                        }
                        columns={[
                            {
                                name: "email"
                            },
                            {
                                name: "expiresAt"
                            }
                        ]}
                        actions={[
                            // todo: add re-send and revoke
                            {
                                title: t("copyInviteLink"),
                                onRowClick: async (
                                    invitation: OrganizationInvitationRepresentation
                                ) => {
                                    try {
                                        await navigator.clipboard.writeText(
                                            invitation.inviteLink!
                                        );
                                        addAlert(t("inviteLinkCopied"));
                                    } catch (error) {
                                        addError("clipboardCopyError", error);
                                    }
                                }
                            }
                        ]}
                    />
                </ErrorBoundaryFallback>
            </ErrorBoundaryProvider>
        </>
    );
};
