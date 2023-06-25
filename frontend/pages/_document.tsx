import { Html, Head, Main, NextScript } from 'next/document'
// Documento do Next.js
export default function Document() {
  return (
    <Html lang="pt-br">
      <Head >
        {/* favicon da página */}
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
