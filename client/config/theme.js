import { useFonts } from 'expo-font';

const theme = {
    colors: {
      primary: '#007BFF', // Colore primario
      background: '#E8F0FF', // Sfondo
      textPrimary: '#000000', // Testo principale
      textSecondary: '#0055A4', // Testo secondario
      danger: '#e74c3c', // Colore per errori
    },
    fonts: {
        primary: 'Verdana', // Nome del font principale
        secondary: 'Georgia', // Nome del font secondario
    },
  };
  
  // Hook per caricare i font
export const useCustomFonts = () => {
    const [fontsLoaded] = useFonts({
      [theme.fonts.primary]: require('./fonts/verdana/verdana.ttf'),
      [theme.fonts.secondary]: require('./fonts/georgia/georgia.ttf'),
    });
  
    return fontsLoaded;
  };
  
  export default theme;