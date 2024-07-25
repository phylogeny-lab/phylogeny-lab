import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";
import { colors } from "@mui/material";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      themes: {
        light: {
          layout: {
            disabledOpacity: 0.3,
            radius: {
              small: "0.375rem", 
              medium: "0.4rem",
              large: "0.5rem", 
            }
          },
          colors: {
            primary: {
              DEFAULT: colors.grey[200],
              foreground: "#5a7f90",
            },
            success: {
              DEFAULT: colors.green[600],
              foreground: colors.grey[200],
            },
            focus: colors.grey[200],
            secondary: {
              DEFAULT: colors.blue[600],
              foreground: colors.grey[200]
            },
            default: {
              DEFAULT: colors.grey[400]
            }
          },
        },
        dark: {
          layout: {
            disabledOpacity: 0.3,
            radius: {
              small: "0.375rem",
              medium: "0.4rem", 
              large: "0.5rem", 
            }
          },
          colors: {
            primary: {
              DEFAULT: colors.grey[200],
              foreground: "#5a7f90",
            },
            success: {
              DEFAULT: colors.green[600],
              foreground: colors.grey[200],
            },
            focus: colors.grey[200],
            secondary: {
              DEFAULT: colors.blue[600],
              foreground: colors.grey[200]
            },
            default: {
              DEFAULT: colors.grey[400]
            }
          },
        },
      },
    }),
  ],
};
export default config;
