import { Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export const RenderQRCode = ({url}: {url: string | null}) => {
  try {
    if (!url) throw new Error("Invalid QR code URL");
    return (
      <QRCode
        value={url ? url : ""}
        size={250}
        color="black"
        backgroundColor="white"
      />
    );
  } catch (error) {
    Alert.alert("QR - Pay", "QR yaratib bo'lmadi");
    return null;
  }
};
