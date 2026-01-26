import {
    BaseEnvironment,
    FormSubmitButton,
    TextControl,
    useEnvironment
} from "../../../shared/keycloak-ui-shared";
import { Button, ButtonVariant, Form, Modal, ModalVariant } from "@patternfly/react-core";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { inviteOrganizationMember } from "../../api/orgs-sidecar-methods";
import { useContext } from "react";
import { KcContextEnv } from "../../KcContextEnv";

type InviteMemberModalProps = {
    orgId: string;
    onClose: () => void;
};

export const InviteMemberModal = ({ orgId, onClose }: InviteMemberModalProps) => {
    const { addAlert, addError } = useAlerts();

    const { t } = useTranslation();
    const context = useEnvironment<BaseEnvironment>();
    const kcContext = useContext(KcContextEnv)!;
    const form = useForm<Record<string, string>>();
    const { handleSubmit, formState } = form;

    const submitForm = async (data: Record<string, string>) => {
        try {
            const email = data["email"];
            await inviteOrganizationMember(context, kcContext, orgId, email);
            addAlert(t("inviteSent"));
            onClose();
        } catch (error) {
            addError("inviteSentError", error);
        }
    };

    return (
        <Modal
            variant={ModalVariant.small}
            title={t("inviteMember")}
            description={t("inviteMemberDescription")}
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
                        name="email"
                        label={t("email")}
                        rules={{ required: t("required") }}
                        autoFocus
                    />
                </Form>
            </FormProvider>
        </Modal>
    );
};
