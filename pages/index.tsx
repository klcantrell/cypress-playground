import Head from 'next/head';
import Characters from '../components/Characters';
import styles from '../styles/Home.module.css';

export default function Home(): React.ReactElement {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cypress Testing Playground</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <h1>TDD Cypress Demo</h1>
      <Characters />
    </div>
  );
}