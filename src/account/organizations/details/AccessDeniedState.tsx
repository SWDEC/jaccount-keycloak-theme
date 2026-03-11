import { ListEmptyState } from "@/shared/keycloak-ui-shared";
import { TimesCircleIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";

export const AccessDeniedState = () => {
    const { t } = useTranslation();

    return (
        <ListEmptyState
            message={t("accessDenied")}
            instructions={t("accessDenied")}
            icon={TimesCircleIcon}
        />
    );
};
