import ReactModal from 'react-modal'

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
            <ReactModal isOpen={isOpen} onRequestClose={handleClose}>
                Test
                <br />
                <button onClick={() => handleClose()} type="button">
                    Finish
                </button>
            </ReactModal>
        </>
    )
}

export default TodoDialog;