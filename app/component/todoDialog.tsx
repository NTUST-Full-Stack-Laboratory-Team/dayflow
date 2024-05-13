import { Modal } from 'antd';

interface Props {
    isOpen: boolean;
    onClose?: () => void;
}

export const TodoDialog = (props: Props) => {
    const { isOpen, onClose } = props;

    const handleClose = () => {
        onClose?.();
    }

    return (
        <>
            <Modal title="Todo" open={isOpen} onOk={() => handleClose()} onCancel={() => handleClose()}>
                <p>To be continue...</p>
            </Modal>
        </>
    )
}

export default TodoDialog;