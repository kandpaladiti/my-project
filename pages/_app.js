// pages/_app.js

import * as React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import '../styles/globals.css'; // Make sure this line is present

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32', // green shade for agriculture theme
    },
    secondary: {
      main: '#f9a825', // yellow accent
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <title>Crop Varieties Management</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="Manage crop varieties efficiently with our full-stack application." />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
