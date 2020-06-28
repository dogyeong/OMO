import App from 'next/app'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import 'antd/dist/antd.css'
import { Layout } from 'antd'
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
        <Layout style={{ minHeight: '100vh' }}>
          <Header>
            <Navbar {...this.props} />
          </Header>
          <Content>
            <Component {...pageProps} />
          </Content>
        </Layout>
      </React.Fragment>
    )
  }
}

export default MyApp
