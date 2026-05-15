import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import {
    ErrorBoundaryProvider,
    KeycloakSpinner,
    ListEmptyState,
    OrganizationTable,
    useEnvironment
} from "../../../shared/keycloak-ui-shared";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserOrganizations } from "../../api/methods";
import { Page } from "../../components/page/Page";
import { Environment } from "../../environment";
import { usePromise } from "../../utils/usePromise";
import { Card } from "@/components/ui/card";
import { Button, Hint, HintBody, HintFooter, HintTitle } from "@patternfly/react-core";

interface OrganizationOverviewProps {
    onSelectOrg: (orgId: string) => void;
}

export const OrganizationOverview: React.FC<OrganizationOverviewProps> = ({
    onSelectOrg: _onSelectOrg
}) => {
    const { t } = useTranslation();
    const context = useEnvironment<Environment>();

    const [userOrgs, setUserOrgs] = useState<OrganizationRepresentation[]>([]);

    usePromise(signal => getUserOrganizations({ signal, context }), setUserOrgs);

    if (!userOrgs) {
        return <KeycloakSpinner />;
    }

    return (
        <Page title={t("organizations")} description={t("organizationDescription")}>
            <ErrorBoundaryProvider>
                <Hint>
                    <HintTitle>Meine Jugendarbeit verwalten</HintTitle>
                    <HintBody>Wenn du Admin-Rechte hast, kannst du die Leute deiner Jugendarbeit in der Admin-Konsole verwalten</HintBody>
                    <HintFooter>
                        <Button>Zur Admin-Konsole</Button>
                    </HintFooter>
                </Hint>
                <Card>
                    <OrganizationTable
                        link={({ organization: _organization, children }) => (children)}
                        /*link={({ organization, children }) => (
                            <Button
                                variant={ButtonVariant.link}
                                onClick={() => {
                                    onSelectOrg(organization.id!);
                                }}
                            >
                                {children}
                            </Button>
                        )}*/
                        loader={userOrgs}
                    >
                        <ListEmptyState
                            message={t("emptyUserOrganizations")}
                            instructions={t("emptyUserOrganizationsInstructions")}
                        />
                    </OrganizationTable>
                </Card>
            </ErrorBoundaryProvider>
        </Page>
    );
};
