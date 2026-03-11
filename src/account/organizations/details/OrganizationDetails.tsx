import {
    Breadcrumb,
    BreadcrumbItem,
    PageBreadcrumb,
    Tab,
    Tabs
} from "@patternfly/react-core";
import {
    BaseEnvironment,
    ErrorPage,
    KeycloakSpinner,
    useEnvironment
} from "../../../shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { Page } from "../../components/page/Page";
import { useState } from "react";
import { Link } from "react-router-dom";
import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import { getUserOrganizations } from "@/account/api/methods";
import { Members } from "./members/Members";
import { usePromise } from "@/account/utils/usePromise";
import { Invitations } from "./invitations/Invitations";
import { Groups } from "./groups/Groups";

interface OrganizationDetailsProps {
    orgId: string;
    onGoToOverview: () => void;
}

export const OrganizationDetails = ({
    orgId,
    onGoToOverview
}: OrganizationDetailsProps) => {
    const { t } = useTranslation();
    const context = useEnvironment<BaseEnvironment>();

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
        []
    );

    const [activeTab, setActiveTab] = useState<string | number>("members");

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (loading) {
        return <KeycloakSpinner />;
    }

    return (
        <>
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
            <Page
                title={org?.name || "Unknown organization"}
                description={t("organizationDetailsDescription")}
            >
                <Tabs
                    activeKey={activeTab}
                    onSelect={(_event, eventKey) => {
                        setActiveTab(eventKey);
                    }}
                    isBox
                >
                    <Tab title={t("people")} eventKey="members">
                        <Members orgId={orgId} />
                    </Tab>
                    <Tab title={t("invitations")} eventKey="invitations">
                        <Invitations orgId={orgId} />
                    </Tab>
                    <Tab title={t("groups")} eventKey="groups">
                        <Groups orgId={orgId} />
                    </Tab>
                </Tabs>
            </Page>
        </>
    );
};
