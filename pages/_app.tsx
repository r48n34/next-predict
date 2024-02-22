// import '@/styles/globals.css'
import '@mantine/core/styles.css';
import NextProgress from "next-progress";
import Head from 'next/head';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

import type { AppProps } from 'next/app'
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Is a website</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />

        <meta name="description" content="Is a website" />
        <meta name="google-site-verification" content="MSmy-J4XDNXLBlFKqvooWG7RzHPvXmjhSo1BWtgF40E" />

        <meta property="og:title" content="Is a website" />
        <meta property="og:description" content="Is a website" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:type" content="website" />

        <meta property="og:url" content="https://github.com/" />
        <meta name="theme-color" content="#1a1b1e" />
      </Head>

      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto">
        <NextProgress />
        <Layout>
        <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </>
  )
}
