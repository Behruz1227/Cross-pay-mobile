export interface ICenteredModalProps {
    children: JSX.Element; //modal body qismi
    btnWhiteText: string | JSX.Element; // oq btn uchun text
    btnRedText: string | JSX.Element; // qizil btn uchun text
    isFullBtn: boolean; // btn lar row yoki col joylashishi uchun trueOrfalse
    isModal: boolean; // modal ochish uchin state uzgaruvchi
    toggleModal: () => void; // modalni ochib yopish uchun function m: => const toggleModal = () => setIsModal(!isModal);
    onConfirm?: () => void; //tasdiqlash uchun function
    oneBtn?: boolean
  }
  