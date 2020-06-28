import { authInitialProps } from '../lib/auth'
import { getUser } from '../lib/api'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton, Card, Avatar, Layout, Button, Divider } from 'antd'
const { Meta } = Card

export default function Profile({ auth, userId }) {
  const [user, setUser] = useState({})
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isAuth = auth.user._id === userId
    setIsAuth(isAuth)
    ;(async function () {
      getUser(userId).then((user) => {
        setUser(user)
        setIsLoading(false)
      })
    })()
  }, [])

  return (
    <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card
        style={{ width: 640, marginTop: 32 }}
        title="프로필"
        /* Auth - Edit Buttons / UnAuth - Follow Buttons */
        extra={
          isAuth ? (
            <Button>
              <Link href="/edit-profile">
                <a>편집</a>
              </Link>
            </Button>
          ) : (
            <Button>팔로우</Button>
          )
        }
      >
        <Skeleton loading={isLoading} avatar active>
          <Meta
            avatar={<Avatar src={`${user.avatar}`} size={50} />}
            title={`${user.name}`}
            description={user.email}
          />
        </Skeleton>
        <Divider />
        가입일 : {user.createdAt}
      </Card>
    </Layout>
  )
}

Profile.getInitialProps = authInitialProps(true)
