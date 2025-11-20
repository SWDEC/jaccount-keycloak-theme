import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    PageBreadcrumb,
    ToolbarItem
} from "@patternfly/react-core";
import {
    ErrorBoundaryProvider,
    ErrorPage,
    KeycloakDataTable,
    KeycloakSpinner,
    useAlerts,
    useEnvironment
} from "../../../shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { Page } from "../../components/page/Page";
import { useState } from "react";
import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import { usePromise } from "../../utils/usePromise";
import { getUserOrganizations } from "../../api/methods";
import { InviteMemberModal } from "./InviteMemberModal";
import { UserRepresentation } from "../../api/representations";
import { Link } from "react-router-dom";
import { RemoveMemberModal } from "./RemoveMemberModal";
import { removeOrganizationMembers } from "../../api/orgs-sidecar-methods";
import { OrgSidecarEnvironment } from "../../org-sidecar-environment";

interface OrganizationDetailsProps {
    orgId: string;
    onGoToOverview: () => void;
}

export const OrganizationDetails = ({
    orgId,
    onGoToOverview
}: OrganizationDetailsProps) => {
    const { t } = useTranslation();
    const context = useEnvironment<OrgSidecarEnvironment>();
    const { addError, addAlert } = useAlerts();

    const [key, setKey] = useState(0);
    const refresh = () => setKey(key + 1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [org, setOrg] = useState<OrganizationRepresentation | undefined>(undefined);

    usePromise(
        signal => getUserOrganizations({ signal, context }),
        organizations => {
            const organizationMatchingId = organizations.find(org => org.id == orgId);
            setLoading(false);

            if (organizationMatchingId) {
                setOrg(organizationMatchingId);
            } else {
                setError(
                    new Error(
                        "This organization does not exist or you do not have access to it"
                    )
                );
            }
        }
    );

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

    const loader = async (first?: number, max?: number) => {
        try {
            const members: UserRepresentation[] = [{}];
            // TODO: Fetch actual members

            return members;
        } catch (error) {
            addError("organizationsMembersListError", error);
            return [];
        }
    };

    const removeMember = async (selectedMembers: UserRepresentation[]) => {
        try {
            clearMembersToRemove();

            alert("TODO: Remove user");
            const users = selectedMembers.map(user => user.id);
            removeOrganizationMembers(context, users, orgId);

            addAlert(t("organizationUsersLeft", { count: selectedMembers.length }));
        } catch (error) {
            addError("organizationUsersLeftError", error);
        }

        refresh();
    };

    const sendPasswordResetMail = async (users: UserRepresentation[]) => {
        try {
            await Promise.all(
                users.map(user => {
                    alert("TODO: Actually send password reset");
                })
            );
            addAlert(t("passwordResetSent"));
        } catch (error) {
            addError("passwordResetError", error);
        }
    };

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (loading) {
        return <KeycloakSpinner />;
    }

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
            <PageBreadcrumb>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link onClick={onGoToOverview}>{t("organizations")}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>{org?.name}</BreadcrumbItem>
                </Breadcrumb>
            </PageBreadcrumb>
            <Page title={org?.name || "Unknown organization"} description="">
                <ErrorBoundaryProvider>
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
                                name: "2fa"
                            },
                            {
                                name: "roles"
                            },
                            {
                                name: "email"
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
                                title: t("passwordReset"),
                                onRowClick: member => {
                                    sendPasswordResetMail([member]);
                                }
                            }
                        ]}
                    />
                </ErrorBoundaryProvider>
            </Page>
        </>
    );
};
