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
          colors: {
            primary: {
              DEFAULT: colors.grey[200],
              foreground: "#5a7f90",
            },
            success: {
              DEFAULT: colors.green[600],
            },
            focus: colors.grey[200],
            secondary: colors.blue[600],
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: colors.grey[200],
              foreground: "#5a7f90",
            },
            success: {
              DEFAULT: colors.green[600],
            },
            focus: colors.grey[200],
            secondary: colors.blue[600],
          },
        },
      },
    }),
  ],
};
export default config;
