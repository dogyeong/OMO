import { authInitialProps } from '../lib/auth'
import Link from 'next/link'
import { Button, Layout } from 'antd'

const { Content, Sider } = Layout
import PostFeed from '../components/index/PostFeed'
import UserFeed from '../components/index/UserFeed'
import Landing from '../components/index/Landing'

export default function Index({ auth }) {
  return (
    <React.Fragment>
      {auth.user && auth.user._id ? (
        <Layout>
          <Content>
            <PostFeed auth={auth} />
          </Content>
          <Sider width={240}>
            <UserFeed auth={auth} />
          </Sider>
        </Layout>
      ) : (
        <Landing />
      )}
    </React.Fragment>
  )
}

Index.getInitialProps = authInitialProps()
