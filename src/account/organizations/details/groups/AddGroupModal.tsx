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
import { addGroup } from "../../../api/orgs-sidecar-methods";
import { getKcContext } from "../../../KcContext";

type AddGroupModalProps = {
    orgId: string;
    onClose: () => void;
};

export const AddGroupModal = ({ orgId, onClose }: AddGroupModalProps) => {
    const { addAlert, addError } = useAlerts();

    const { t } = useTranslation();
    const context = useEnvironment<BaseEnvironment>();
    const { kcContext } = getKcContext();
    const form = useForm<Record<string, string>>();
    const { handleSubmit, formState } = form;

    const submitForm = async (data: Record<string, string>) => {
        try {
            const groupName = data["groupName"];
            await addGroup(context, kcContext, orgId, groupName);
            addAlert(t("groupAdded"));
            onClose();
        } catch (error) {
            addError("groupAddError", error);
        }
    };

    return (
        <Modal
            variant={ModalVariant.small}
            title={t("addGroup")}
            description={t("addGroupDescription")}
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
                        name="groupName"
                        label={t("groupName")}
                        rules={{ required: t("required") }}
                        autoFocus
                    />
                </Form>
            </FormProvider>
        </Modal>
    );
};
