/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260305.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/organizations/Organizations.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import {
    ErrorBoundaryProvider,
    KeycloakSpinner,
    ListEmptyState,
    OrganizationTable,
    useEnvironment
} from "../../shared/keycloak-ui-shared";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserOrganizations } from "../api/methods";
import { Page } from "../components/page/Page";
import { Environment } from "../environment";
import { usePromise } from "../utils/usePromise";
import { Link, useSearchParams } from "react-router-dom";
import { OrganizationDetails } from "./details/OrganizationDetails";
import { OrganizationOverview } from "./overview/OrganizationOverview";

export const Organizations = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const onGoToOverview = () => {
        setSearchParams(undefined);
    };

    const setSelectedOrgId = orgId => {
        setSearchParams({ orgId });
    };

    const orgId = searchParams.get("orgId");

    if (orgId != null) {
        return <OrganizationDetails orgId={orgId} onGoToOverview={onGoToOverview} />;
    } else {
        return <OrganizationOverview onSelectOrg={setSelectedOrgId} />;
    }
};

export default Organizations;
