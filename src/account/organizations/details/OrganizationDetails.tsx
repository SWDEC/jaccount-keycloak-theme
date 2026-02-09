import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    PageBreadcrumb,
    ToolbarItem,
    Tooltip
} from "@patternfly/react-core";
import {
    BaseEnvironment,
    ErrorBoundaryFallback,
    ErrorBoundaryProvider,
    ErrorPage,
    KeycloakDataTable,
    KeycloakSpinner,
    ListEmptyState,
    useAlerts,
    useEnvironment
} from "../../../shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { Page } from "../../components/page/Page";
import { useContext, useState } from "react";
import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import { usePromise } from "../../utils/usePromise";
import { getUserOrganizations } from "../../api/methods";
import { InviteMemberModal } from "./InviteMemberModal";
import { UserRepresentation } from "../../api/representations";
import { Link } from "react-router-dom";
import { RemoveMemberModal } from "./RemoveMemberModal";
import {
    getOrganizationMembers,
    makeOrganizationManager,
    removeOrganizationMember
} from "../../api/orgs-sidecar-methods";
import { KcContextEnv } from "../../KcContextEnv";
import { MakeManagerModal } from "./MakeManagerModal";
import {
    CheckCircleIcon,
    CloseIcon,
    CrossIcon,
    ExclamationCircleIcon,
    LockIcon,
    LockOpenIcon,
    ShieldAltIcon,
    ShieldVirusIcon
} from "@patternfly/react-icons";

interface OrganizationDetailsProps {
    orgId: string;
    onGoToOverview: () => void;
}

const NoAccessErrorRenderer = () => {
    const { t } = useTranslation();

    return (
        <ListEmptyState message={t("accessDenied")} instructions={t("accessDenied")} />
    );
};

export const OrganizationDetails = ({
    orgId,
    onGoToOverview
}: OrganizationDetailsProps) => {
    const { t } = useTranslation();
    const context = useEnvironment<BaseEnvironment>();
    const kcContext = useContext(KcContextEnv)!;
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
        },
        [key]
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
                    return makeOrganizationManager(context, kcContext, member.id, orgId);
                })
            );

            addAlert(t("organizationMadeManager", { count: selectedMembers.length }));
        } catch (error) {
            addError("organizationMakeManagerError", error);
        }

        refresh();
    };

    const loader = async (first?: number, max?: number) => {
        try {
            return await getOrganizationMembers(context, kcContext, orgId, first, max);
        } catch (error) {
            addError("organizationsMembersListError", error);
            return [];
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
            {membersToMakeManager && (
                <MakeManagerModal
                    onClose={clearMembersToMakeManager}
                    onSubmit={() => {
                        makeManager(membersToMakeManager);
                    }}
                />
            )}
            <PageBreadcrumb>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link onClick={onGoToOverview} to="">
                            {t("organizations")}
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>{org?.name}</BreadcrumbItem>
                </Breadcrumb>
            </PageBreadcrumb>
            <Page title={org?.name || "Unknown organization"} description="">
                <ErrorBoundaryProvider>
                    <ErrorBoundaryFallback fallback={NoAccessErrorRenderer}>
                        <KeycloakDataTable
                            key={key}
                            loader={loader}
                            ariaLabelKey="membersList"
                            toolbarItem={
                                <ToolbarItem>
                                    <Button
                                        variant="primary"
                                        onClick={toggleInviteMembers}
                                    >
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
            </Page>
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
