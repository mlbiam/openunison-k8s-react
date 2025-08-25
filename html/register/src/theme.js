import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import configData from './config/config.json'

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#AC1622',
      dark: '#780f17',
      light: '#bc444e',

    },
    secondary: {
      main: '#16aca0',
      dark: '#0f7870',
      light: '#44bcb3',
    },
    error: {
      main: red.A400,
    },
    text: {
      secondary: '#595959',
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#595959', // Default state
        },
        shrink: {
          color: '#595959', // When label is shrunk (focused or filled)
        },
      },
    },
  },
});

export default theme;
