import { Button, ToolbarItem } from "@patternfly/react-core"
import { ErrorBoundaryProvider, ErrorPage, KeycloakDataTable, KeycloakSpinner, useEnvironment } from "../../../shared/keycloak-ui-shared"
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Page } from "../../components/page/Page";
import { useState } from "react";
import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import { usePromise } from "../../utils/usePromise";
import { getUserOrganizations } from "../../api/methods";
import { Environment } from "../../environment";

export const OrganizationDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const context = useEnvironment<Environment>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [org, setOrg] = useState<OrganizationRepresentation | undefined>(undefined);

    usePromise(
        signal => getUserOrganizations({ signal, context }),
        organizations => {
            const organizationMatchingId = organizations.find((org) => org.id == id);
            setLoading(false);

            if (organizationMatchingId) {
                setOrg(organizationMatchingId);
            } else {
                setError(new Error("This organization does not exist or you do not have access to it"));
            }
        }
    );

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (loading) {
        return <KeycloakSpinner />;
    }

    return (
        <Page title={org?.name || "Unknown organization"} description="">
            <ErrorBoundaryProvider>
                <div
                    key="dummy">
                    <>
                        <ToolbarItem>
                            <Button variant="primary">
                                {t("inviteMember")}
                            </Button>
                        </ToolbarItem>
                    </>
                </div>
            </ErrorBoundaryProvider>
        </Page>
    )
}