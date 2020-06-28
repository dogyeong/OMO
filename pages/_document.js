import Document, { Html, Head, Main, NextScript } from 'next/document'
import { getSessionFromServer, getUserScript } from '../lib/auth'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const props = await Document.getInitialProps(ctx)
    const user = getSessionFromServer(ctx.req)

    return { ...props, ...user }
  }

  render() {
    const { user = {} } = this.props

    return (
      <Html>
        <Head>
          <Head>
            {/* You can use the head tag, just not for setting <title> as it leads to unexpected behavior */}
            <meta charSet="utf-8" />
            {/* Use minimum-scale=1 to enable GPU rasterization */}
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
            />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
            />
          </Head>
        </Head>
        <body>
          <Main />
          <script dangerouslySetInnerHTML={{ __html: getUserScript(user) }} />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export async function getServerSideProps(ctx) {}
