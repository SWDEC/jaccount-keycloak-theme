import { getKcContext } from "@/account/KcContext";
import { BaseEnvironment, useEnvironment } from "@/shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import {
    ErrorBoundaryFallback,
    ErrorBoundaryProvider,
    KeycloakDataTable
} from "@/shared/keycloak-ui-shared";
import {
    Button,
    ButtonVariant,
    Drawer,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelContent,
    PageSection,
    ToolbarItem
} from "@patternfly/react-core";
import { getOrganizationGroups } from "@/account/api/orgs-sidecar-methods";
import { AccessDeniedState } from "../AccessDeniedState";
import { useState } from "react";
import { GroupDetails } from "./GroupDetails";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { AddGroupModal } from "./AddGroupModal";

interface GroupsProps {
    orgId: string;
}

export const Groups = ({ orgId }: GroupsProps) => {
    const { t } = useTranslation();
    const context = useEnvironment<BaseEnvironment>();
    const { kcContext } = getKcContext();

    const [key, setKey] = useState(0);
    const refresh = () => setKey(key + 1);

    const [selectedGroup, setSelectedGroup] = useState<GroupRepresentation | null>(null);
    const [openCreateGroup, setOpenCreateGroup] = useState(false);

    const loader = async (first?: number, max?: number) => {
        return await getOrganizationGroups(context, kcContext, orgId, first, max, false);
    };

    return (
        <>
            {openCreateGroup && <AddGroupModal orgId={orgId} onClose={() => refresh()} />}
            <ErrorBoundaryProvider>
                <ErrorBoundaryFallback fallback={AccessDeniedState}>
                    <PageSection>
                        <Drawer isInline isExpanded position="left">
                            <DrawerContent
                                panelContent={
                                    <DrawerPanelContent isResizable>
                                        <KeycloakDataTable
                                            key={key}
                                            loader={loader}
                                            ariaLabelKey="groupsList"
                                            toolbarItem={
                                                <ToolbarItem>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() =>
                                                            setOpenCreateGroup(true)
                                                        }
                                                    >
                                                        {t("createGroup")}
                                                    </Button>
                                                </ToolbarItem>
                                            }
                                            columns={[
                                                {
                                                    name: "name",
                                                    cellRenderer: group => (
                                                        <Button
                                                            variant={ButtonVariant.link}
                                                            onClick={() =>
                                                                setSelectedGroup(group)
                                                            }
                                                        >
                                                            {group.name}
                                                        </Button>
                                                    )
                                                }
                                            ]}
                                            actions={[]}
                                        />
                                    </DrawerPanelContent>
                                }
                            >
                                <DrawerContentBody>
                                    {selectedGroup && (
                                        <GroupDetails
                                            orgId={orgId}
                                            group={selectedGroup}
                                        />
                                    )}
                                </DrawerContentBody>
                            </DrawerContent>
                        </Drawer>
                    </PageSection>
                </ErrorBoundaryFallback>
            </ErrorBoundaryProvider>
        </>
    );
};
