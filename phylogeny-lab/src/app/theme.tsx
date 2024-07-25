"use client";

import { colors, createTheme, OutlinedInput } from '@mui/material';
import { color } from 'framer-motion';

const darkTheme = createTheme({
    
    palette: {
      mode: 'dark',
      primary: {
        main: colors.green[600],
        light: colors.grey[200]
      },
      secondary: {
        main: colors.grey[500]
      },
      text: {
        disabled: colors.grey[500]
      },
      info: {
        main: colors.blue[500]
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          }
        }
      }
    },
    shape: {
      
    }
  });

export default darkTheme