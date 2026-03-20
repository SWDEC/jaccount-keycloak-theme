import { useState } from "react";
import {
    getOrganizationMembers,
    removeOrganizationMember
} from "../../../api/orgs-sidecar-methods";
import {
    ErrorBoundaryFallback,
    ErrorBoundaryProvider,
    KeycloakDataTable
} from "@/shared/keycloak-ui-shared";
import { UserRepresentation } from "../../../api/representations";
import { BaseEnvironment, useAlerts, useEnvironment } from "@/shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { MakeManagerModal } from "./MakeManagerModal";
import { RemoveMemberModal } from "./RemoveMemberModal";
import { InviteMemberModal } from "./InviteMemberModal";
import { ExclamationCircleIcon, LockIcon, LockOpenIcon } from "@patternfly/react-icons";
import { Button, ToolbarItem, Tooltip } from "@patternfly/react-core";
import { getKcContext } from "@/account/KcContext";
import { AccessDeniedState } from "../AccessDeniedState";

interface MembersProps {
    orgId: string;
}

export const Members = ({ orgId }: MembersProps) => {
    const { t } = useTranslation();
    const context = useEnvironment<BaseEnvironment>();
    const { kcContext } = getKcContext();
    const { addError, addAlert } = useAlerts();

    const [key, setKey] = useState(0);
    const refresh = () => setKey(key + 1);

    const [openInviteMembers, setInviteMembers] = useState(false);
    const toggleInviteMembers = () => {
        setInviteMembers(!openInviteMembers);
    };

    const [membersToRemove, setMembersToRemove] = useState<
        undefined | UserRepresentation[]
    >(undefined);
    const clearMembersToRemove = () => {
        setMembersToRemove(undefined);
    };

    const removeMember = async (selectedMembers: UserRepresentation[]) => {
        try {
            clearMembersToRemove();

            await Promise.all(
                selectedMembers.map(member => {
                    return removeOrganizationMember(context, kcContext, member.id, orgId);
                })
            );

            addAlert(t("organizationUsersLeft", { count: selectedMembers.length }));
        } catch (error) {
            addError("organizationUsersLeftError", error);
        }

        refresh();
    };

    const [membersToMakeManager, setMembersToMakeManager] = useState<
        undefined | UserRepresentation[]
    >(undefined);
    const clearMembersToMakeManager = () => {
        setMembersToMakeManager(undefined);
    };

    const makeManager = async (selectedMembers: UserRepresentation[]) => {
        try {
            clearMembersToMakeManager();

            await Promise.all(
                selectedMembers.map(member => {
                    console.log(member);
                    addError("Not yet implemented", null);
                })
            );

            addAlert(t("organizationMadeManager", { count: selectedMembers.length }));
        } catch (error) {
            addError("organizationMakeManagerError", error);
        }

        refresh();
    };

    const loader = async (first?: number, max?: number) => {
        return await getOrganizationMembers(context, kcContext, orgId, first, max);
    };

    return (
        <>
            {openInviteMembers && (
                <InviteMemberModal orgId={orgId} onClose={toggleInviteMembers} />
            )}
            {membersToRemove && (
                <RemoveMemberModal
                    onClose={clearMembersToRemove}
                    onSubmit={() => {
                        removeMember(membersToRemove);
                    }}
                />
            )}
            {membersToMakeManager && (
                <MakeManagerModal
                    onClose={clearMembersToMakeManager}
                    onSubmit={() => {
                        makeManager(membersToMakeManager);
                    }}
                />
            )}
            <ErrorBoundaryProvider>
                <ErrorBoundaryFallback fallback={AccessDeniedState}>
                    <KeycloakDataTable
                        key={key}
                        loader={loader}
                        ariaLabelKey="membersList"
                        toolbarItem={
                            <ToolbarItem>
                                <Button variant="primary" onClick={toggleInviteMembers}>
                                    {t("inviteMember")}
                                </Button>
                            </ToolbarItem>
                        }
                        columns={[
                            {
                                name: "firstName"
                            },
                            {
                                name: "lastName"
                            },
                            {
                                name: "email",
                                cellRenderer: ValidatedEmail
                            },
                            {
                                name: "totp",
                                cellRenderer: TotpRenderer
                            },
                            {
                                name: "groups"
                            }
                        ]}
                        actions={[
                            {
                                title: t("remove"),
                                onRowClick: member => {
                                    setMembersToRemove([member]);
                                }
                            },
                            {
                                title: t("makeManager"),
                                onRowClick: member => {
                                    setMembersToMakeManager([member]);
                                }
                            }
                        ]}
                    />
                </ErrorBoundaryFallback>
            </ErrorBoundaryProvider>
        </>
    );
};

const ValidatedEmail = (user: UserRepresentation) => {
    const { t } = useTranslation();
    return (
        <>
            {!user.emailVerified && (
                <Tooltip content={t("notVerified")}>
                    <ExclamationCircleIcon
                        style={{ color: "var(--pf-v5-global--danger-color--100)" }}
                    />
                </Tooltip>
            )}{" "}
            {user.email}
        </>
    );
};

const TotpRenderer = (user: UserRepresentation) => {
    if (user.totp) {
        return (
            <>
                <LockIcon style={{ color: "var(--pf-v5-global--success-color--100)" }} />
            </>
        );
    } else {
        return (
            <>
                <LockOpenIcon style={{ color: "var(--pf-v5-global--Color--200)" }} />
            </>
        );
    }
};
