import { authInitialProps } from '../lib/auth'
import { getUser } from '../lib/api'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton, Card, Avatar, Layout, Button, Divider, Space } from 'antd'
import FollowUser from '../components/profile/FollowUser'
import DeleteUser from '../components/profile/DeleteUser'
const { Meta } = Card

export default function Profile({ auth, userId }) {
  const [user, setUser] = useState({})
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const isAuth = auth.user._id === userId
    setIsAuth(isAuth)
    ;(async function () {
      getUser(userId).then((user) => {
        setIsFollowing(checkFollow(auth, user))
        setUser(user)
        setIsLoading(false)
      })
    })()
  }, [])

  const checkFollow = (auth, user) => {
    return user.followers.findIndex((follower) => follower._id === auth.user._id) > -1
  }

  const toggleFollow = (sendRequest) => {
    sendRequest(userId).then(() => {
      setIsFollowing(!isFollowing)
    })
  }

  return (
    <Layout>
      <div className="responsive">
        <Card
          style={{ width: '100%' }}
          title="프로필"
          /* Auth - Edit Buttons / UnAuth - Follow Buttons */
          extra={
            isAuth ? (
              <Space>
                <Button>
                  <Link href="/edit-profile">
                    <a>수정</a>
                  </Link>
                </Button>
                <DeleteUser user={user} />
              </Space>
            ) : (
              <FollowUser isFollowing={isFollowing} toggleFollow={toggleFollow} />
            )
          }
        >
          <Skeleton loading={isLoading} avatar active>
            <Meta
              avatar={<Avatar src={`${user.avatar}`} size={100} />}
              title={`${user.name}`}
              description={user.email}
            />
          </Skeleton>
          <Divider />
          <p>{user.about}</p>
          가입일 : {user.createdAt}
        </Card>
      </div>

      <style jsx>
        {`
          .responsive {
            width: 600px;
            margin: 0 auto;
          }

          @media screen and (max-width: 700px) {
            .responsive {
              width: 100%;
            }
          }
        `}
      </style>
    </Layout>
  )
}

Profile.getInitialProps = authInitialProps(true)
