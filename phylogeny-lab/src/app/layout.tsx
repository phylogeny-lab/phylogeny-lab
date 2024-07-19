import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import GlobalStyleProvider from "./providers/GlobalStyleProvider";
import Hr from "./Components/Hr/Hr";
import Navbar from "./Components/Navbar/Navbar";
import { ThemeProvider } from "@mui/material";
import darkTheme from "./theme";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Phylogeny lab",
  description: "Phylogenetics web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Hr />
        <Navbar />
        <GlobalStyleProvider>  
        <ThemeProvider theme={darkTheme}>
          <ToastContainer />
          {children}
        </ThemeProvider>
        </GlobalStyleProvider>
      </body>
    </html>
  );
}
