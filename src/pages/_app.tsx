import { AppProps } from 'next/app';
import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Header />
      <main className={commonStyles.pageContainer}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
