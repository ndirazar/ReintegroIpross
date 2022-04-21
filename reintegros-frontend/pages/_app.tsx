import React from 'react';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { get } from '../components/api-call/service';
import { ThemeProvider } from '@material-ui/core/styles';
import { APP_NAME } from '../labels';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../styles/theme';
import '../styles/globals.css';
import '../styles/fonts.css';

function App({ Component, pageProps }) {
  const fetcher = (url) => get(url).then((res) => res.data);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SWRConfig value={{ fetcher }}>
        <Head>
          <title>{APP_NAME}</title>
          <meta name="viewport" content="width=device-width" />
        </Head>
        <Component {...pageProps} />
      </SWRConfig>
    </ThemeProvider>
  );
}

export default App;
