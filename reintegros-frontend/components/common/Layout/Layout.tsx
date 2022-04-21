import { AppBar, Box, Button, Container, Toolbar } from '@material-ui/core';
import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from './NavBar';
import SpinnerAlert from '../Feedback/SpinnerAlert';
import LoadingProvider from '../providers/Loading';
import AlertProvider from '../providers/Alert';
import MessageAlert from '../Feedback/MessageAlert';

type Props = {
  children: ReactNode | ReactNode[];
};

export default function Layout(props: Props) {
  const router = useRouter();

  return (
    <>
      <AlertProvider>
        <LoadingProvider>
          <NavBar />
          <Container>
            <Box mt={5}>
              <main>{props.children}</main>
            </Box>
          </Container>
          <MessageAlert />
          <SpinnerAlert />
        </LoadingProvider>
      </AlertProvider>
    </>
  );
}
