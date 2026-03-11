import { Button, ButtonVariant, Modal, ModalVariant } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

interface RemoveMemberModalProps {
    onClose: () => void;
    onSubmit: () => void;
}

export const RemoveMemberModal = ({ onClose, onSubmit }: RemoveMemberModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            variant={ModalVariant.small}
            title={t("removeMember")}
            description={t("removeMemberDescription")}
            isOpen
            onClose={onClose}
            actions={[
                <Button
                    id="modal-confirm"
                    data-testid="remove"
                    key="remove"
                    variant={ButtonVariant.danger}
                    onClick={onSubmit}
                >
                    {t("remove")}
                </Button>,
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
            <></>
        </Modal>
    );
};
