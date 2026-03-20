import { getKcContext } from "@/account/KcContext";
import {
    BaseEnvironment,
    ErrorBoundaryFallback,
    ErrorBoundaryProvider,
    KeycloakDataTable,
    ListEmptyState,
    useEnvironment
} from "@/shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AddGroupMemberModal } from "./AddGroupMemberModal";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { Button, PageSection, Tab, Tabs, ToolbarItem } from "@patternfly/react-core";
import { AccessDeniedState } from "../AccessDeniedState";
import { getOrganizationGroupMembers } from "@/account/api/orgs-sidecar-methods";

interface GroupDetailsProps {
    orgId: string;
    group: GroupRepresentation;
}

export const GroupDetails = ({ orgId, group }: GroupDetailsProps) => {
    const { t } = useTranslation();
    const context = useEnvironment<BaseEnvironment>();
    const { kcContext } = getKcContext();

    const [openAddGroupMember, setOpenAddGroupMember] = useState(false);
    const [activeTab, setActiveTab] = useState<string | number>("members");

    const loader = async (first?: number, max?: number) => {
        return await getOrganizationGroupMembers(
            context,
            kcContext,
            orgId,
            group.id!,
            first,
            max
        );
    };

    return (
        <>
            {openAddGroupMember && (
                <AddGroupMemberModal
                    orgId={orgId}
                    groupId={group.id!}
                    onClose={() => setOpenAddGroupMember(false)}
                />
            )}
            <PageSection>
                <p>{group.name}</p>
                <p>{group.description}</p>
            </PageSection>
            <PageSection>
                <Tabs
                    activeKey={activeTab}
                    onSelect={(_event, eventKey) => {
                        setActiveTab(eventKey);
                    }}
                >
                    <Tab title={t("members")} eventKey="members">
                        <ErrorBoundaryProvider>
                            <ErrorBoundaryFallback fallback={AccessDeniedState}>
                                <KeycloakDataTable
                                    key={group.id}
                                    loader={loader}
                                    ariaLabelKey="membersList"
                                    toolbarItem={
                                        <ToolbarItem>
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    setOpenAddGroupMember(true)
                                                }
                                            >
                                                {t("addGroupMember")}
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
                                            name: "email"
                                        }
                                    ]}
                                    actions={[
                                        {
                                            title: t("remove"),
                                            onRowClick: member => {
                                                alert("todo: remove " + member);
                                                //setMembersToRemove([member]);
                                            }
                                        }
                                    ]}
                                    emptyState={
                                        <ListEmptyState
                                            message="No members"
                                            instructions="There are no members in this group yet"
                                            primaryActionText="Add someone"
                                            onPrimaryAction={() => alert("todo")}
                                        />
                                    }
                                />
                            </ErrorBoundaryFallback>
                        </ErrorBoundaryProvider>
                    </Tab>
                </Tabs>
            </PageSection>
        </>
    );
};
