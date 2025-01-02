const theme = {
    colors: {
      primary: '#007BFF', // Colore primario
      secondary: '#F5F5F5', // Colore secondario
      background: '#FFFFFF', // Sfondo
      textPrimary: '#000000', // Testo principale
      textSecondary: '#007BFF', // Testo secondario
      danger: '#e74c3c', // Colore per errori
    },
    fonts: {
        primary: 'PrimaryFont', // Nome del font principale
        secondary: 'SecondaryFont', // Nome del font secondario
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