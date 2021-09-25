import { AppProps } from 'next/app';
import { CharactersProvider } from '../context/characters';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <CharactersProvider>
      <Component {...pageProps} />
    </CharactersProvider>
  );
}

export default MyApp;
