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
import { Environment } from "../../environment";
import { InviteMemberModal } from "./InviteMemberModal";
import { UserRepresentation } from "../../api/representations";
import { Link } from "react-router-dom";
import { RemoveMemberModal } from "./RemoveMemberModal";

interface OrganizationDetailsProps {
    orgId: string;
    onGoToOverview: () => void;
}

export const OrganizationDetails = ({
    orgId,
    onGoToOverview
}: OrganizationDetailsProps) => {
    const { t } = useTranslation();
    const context = useEnvironment<Environment>();
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

            await Promise.all(
                selectedMembers.map(user => {
                    alert("TODO: Remove user");
                    // TODO
                    /*adminClient.organizations.delMember({
                        orgId,
                        userId: user.id!
                    })*/
                })
            );
            addAlert(t("organizationUsersLeft", { count: selectedMembers.length }));
        } catch (error) {
            addError("organizationUsersLeftError", error);
        }

        refresh();
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
                                name: "roles"
                            },
                            {
                                name: "email"
                            },
                            {
                                name: "username"
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
                                title: t("remove"),
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
