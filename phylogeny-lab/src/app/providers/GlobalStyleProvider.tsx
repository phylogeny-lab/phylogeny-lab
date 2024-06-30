"use client";

import React from 'react'
import styled from "styled-components"
import {NextUIProvider} from '@nextui-org/react'

interface Props {
    children: React.ReactNode;
}

function GlobalStyleProvider({ children }: Props) {
  return (
  
  <GlobalStyles>
    <NextUIProvider>
      {children}
    </NextUIProvider>
  </GlobalStyles>
  );
}

const GlobalStyles = styled.div`
    background: rgb(12, 14, 12);
    padding: 2.5rem;
    height: calc(100vh - var(--navbar-height));
`;

export default GlobalStyleProvider