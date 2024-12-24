import { observer } from 'mobx-react-lite';
import { Dialog, DialogContent } from '@mui/material';
import { useStore } from '../../stores/store';

const ModalContainer = () => {
    const { modalStore } = useStore();

    return (
        <Dialog 
            open={modalStore.modal.open} 
            onClose={modalStore.closeModal} 
            maxWidth="sm" 
            fullWidth
        >
            <DialogContent>
                {modalStore.modal.body}
            </DialogContent>
        </Dialog>
    );
};

export default observer(ModalContainer);
