import { Dimensions } from 'react-native';

// Qurilma ekranining kengligini olish
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mos keluvchi dizayn ekran kengligi (masalan, 375 — iPhone 11)
const BASE_WIDTH = 375;

// Moslashtirilgan piksel hisoblash funksiyasi
export const responsivePixel = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size - 1;
};
export const responsiveSpacing = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size - 10;
};
