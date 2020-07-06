import App from 'next/app'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import 'antd/dist/antd.css'
import { Layout, ConfigProvider } from 'antd'
const { Header, Content } = Layout
import Nprogress from 'nprogress'
import Router from 'next/router'

Router.onRouteChangeStart = () => Nprogress.start()
Router.onRouteChangeComplete = () => Nprogress.done()
Router.onRouteChangeError = () => Nprogress.done()

class MyApp extends App {
  constructor(props) {
    super(props)
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <React.Fragment>
        <Head>
          <title>오늘 모목지</title>
        </Head>
        <ConfigProvider componentSize="large" space="middle">
          <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header style={{ padding: 0 }}>
              <Navbar {...this.props} />
            </Header>
            <div className="responsive">
              <Content style={{ display: 'flex' }}>
                <Component {...pageProps} />
              </Content>
            </div>
          </Layout>
        </ConfigProvider>

        <style jsx>
          {`
            .responsive {
              display: flex;
              flex: 1;
              width: 100%;
              max-width: 1280px;
              padding: 40px;
              margin: 0 auto;
            }

            @media screen and (max-width: 700px) {
              .responsive {
                width: 100%;
                padding: 12px;
              }
            }
          `}
        </style>
      </React.Fragment>
    )
  }
}

export default MyApp
