import {
    BaseEnvironment,
    FormSubmitButton,
    TextControl,
    useEnvironment
} from "../../../../shared/keycloak-ui-shared";
import { Button, ButtonVariant, Form, Modal, ModalVariant } from "@patternfly/react-core";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { addGroupMember } from "../../../api/orgs-sidecar-methods";
import { getKcContext } from "../../../KcContext";

type AddGroupMemberModalProps = {
    orgId: string;
    groupId: string;
    onClose: () => void;
};

export const AddGroupMemberModal = ({
    orgId,
    groupId,
    onClose
}: AddGroupMemberModalProps) => {
    const { addAlert, addError } = useAlerts();

    const { t } = useTranslation();
    const context = useEnvironment<BaseEnvironment>();
    const { kcContext } = getKcContext();
    const form = useForm<Record<string, string>>();
    const { handleSubmit, formState } = form;

    const submitForm = async (data: Record<string, string>) => {
        try {
            const userId = data["userId"];
            await addGroupMember(context, kcContext, orgId, groupId, userId);
            addAlert(t("groupMemberAdded"));
            onClose();
        } catch (error) {
            addError("groupMemberAddError", error);
        }
    };

    return (
        <Modal
            variant={ModalVariant.small}
            title={t("addGroupMember")}
            description={t("addGroupMemberDescription")}
            isOpen
            onClose={onClose}
            actions={[
                <FormSubmitButton
                    formState={formState}
                    data-testid="save"
                    key="confirm"
                    form="form"
                    allowInvalid
                    allowNonDirty
                >
                    {t("send")}
                </FormSubmitButton>,
                <Button
                    id="modal-cancel"
                    data-testid="cancel"
                    key="cancel"
                    variant={ButtonVariant.link}
                    onClick={onClose}
                >
                    {t("cancel")}
                </Button>
            ]}
        >
            <FormProvider {...form}>
                <Form id="form" onSubmit={handleSubmit(submitForm)}>
                    <TextControl
                        name="userId"
                        label={t("userId")}
                        rules={{ required: t("required") }}
                        autoFocus
                    />
                </Form>
            </FormProvider>
        </Modal>
    );
};
