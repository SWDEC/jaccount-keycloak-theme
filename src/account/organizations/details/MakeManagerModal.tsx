import { Button, ButtonVariant, Modal, ModalVariant } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

interface MakeManagerModalProps {
    onClose: () => void;
    onSubmit: () => void;
}

export const MakeManagerModal = ({ onClose, onSubmit }: MakeManagerModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            variant={ModalVariant.small}
            title={t("makeManager")}
            description={t("makeManagerDescription")}
            isOpen
            onClose={onClose}
            actions={[
                <Button
                    id="modal-confirm"
                    data-testid="makeManager"
                    key="makeManager"
                    variant={ButtonVariant.danger}
                    onClick={onSubmit}
                >
                    {t("makeManager")}
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
