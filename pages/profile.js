import { authInitialProps } from '../lib/auth'
import {
  getUser,
  getPostsByUser,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} from '../lib/api'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, Avatar, Layout, Button, Space, Tabs, Row, Col, message, List, Empty, Spin } from 'antd'
import FollowUser from '../components/profile/FollowUser'
import DeleteUser from '../components/profile/DeleteUser'
import Post from '../components/index/Post'
const { TabPane } = Tabs

export default function Profile({ auth, userId }) {
  const [user, setUser] = useState({})
  const [posts, setPosts] = useState([])
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isDeletingPost, setIsDeletingPost] = useState(false)

  useEffect(() => {
    const isAuth = auth.user._id === userId
    setIsAuth(isAuth)
    ;(async function () {
      const userReq = getUser(userId)
      const postReq = getPostsByUser(userId)
      const user = await userReq
      const posts = await postReq

      setIsFollowing(checkFollow(auth, user))
      setUser(user)
      setPosts(posts)
      setIsLoading(false)
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

  const handleDeletePost = (deletedPost) => {
    setIsDeletingPost(true)
    deletePost(deletedPost._id)
      .then((postData) => {
        const postIndex = posts.findIndex((post) => post._id === postData._id)
        const updatedPosts = [...posts.slice(0, postIndex), ...posts.slice(postIndex + 1)]
        setPosts(updatedPosts)
        message.success('삭제되었습니다')
      })
      .catch((err) => {
        console.error(err)
        message.error('삭제 실패')
      })
      .finally(() => setIsDeletingPost(false))
  }

  const handleToggleLike = (post) => {
    const isPostLiked = post.likes.includes(auth.user._id)
    const sendRequest = isPostLiked ? unlikePost : likePost
    sendRequest(post._id)
      .then((postData) => {
        const postIndex = posts.findIndex((post) => post._id === postData._id)
        const updatedPosts = [...posts.slice(0, postIndex), postData, ...posts.slice(postIndex + 1)]
        setPosts(updatedPosts)
      })
      .catch((err) => console.error(err))
  }

  const handleAddComment = (postId, text) => {
    const comment = { text }
    addComment(postId, comment)
      .then((postData) => {
        const postIndex = posts.findIndex((post) => post._id === postData._id)
        const updatedPosts = [...posts.slice(0, postIndex), postData, ...posts.slice(postIndex + 1)]
        setPosts(updatedPosts)
      })
      .catch((err) => console.log(err))
  }

  const handleDeleteComment = (postId, comment) => {
    deleteComment(postId, comment)
      .then((postData) => {
        const postIndex = posts.findIndex((post) => post._id === postData._id)
        const updatedPosts = [...posts.slice(0, postIndex), postData, ...posts.slice(postIndex + 1)]
        setPosts(updatedPosts)
      })
      .catch((err) => console.log(err))
  }

  const getUserList = (users) => (
    <List
      size="large"
      itemLayout="horizontal"
      dataSource={users}
      renderItem={(user) => (
        <List.Item style={{ borderBottom: 0 }}>
          <List.Item.Meta
            avatar={<Avatar src={user.avatar} />}
            title={
              <Link href={`/profile/${user._id}`}>
                <a>{user.name}</a>
              </Link>
            }
          />
        </List.Item>
      )}
    />
  )

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
          {isLoading ? (
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Spin size="large" />
            </Space>
          ) : (
            <div>
              <Row>
                <Col style={{ paddingRight: '1rem' }}>
                  <Avatar src={`${user.avatar}`} size={100} />
                </Col>
                <Col flex="1 1 auto">
                  <h3>{user.name}</h3>
                  <span>{user.email}</span>
                  <p>{user.about}</p>
                  {/* 가입일 : {user.createdAt} */}
                </Col>
              </Row>
              <Tabs defaultActiveKey="1" centered size="large" tabBarGutter={60} style={{ marginTop: 16 }}>
                <TabPane tab={`게시글 ${posts.length}`} key="1">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <Post
                        key={post._id}
                        auth={auth}
                        post={post}
                        isDeletingPost={isDeletingPost}
                        handleDeletePost={handleDeletePost}
                        handleToggleLike={handleToggleLike}
                        handleAddComment={handleAddComment}
                        handleDeleteComment={handleDeleteComment}
                      />
                    ))
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="게시글이 없습니다" />
                  )}
                </TabPane>
                <TabPane tab={`팔로잉 ${user.following ? user.following.length : 0}`} key="2">
                  {user.following && user.following.length > 0 ? (
                    getUserList(user.following)
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="팔로잉 리스트가 비어 있습니다" />
                  )}
                </TabPane>
                <TabPane tab={`팔로워 ${user.followers ? user.followers.length : 0}`} key="3">
                  {user.followers && user.followers.length > 0 ? (
                    getUserList(user.followers)
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="팔로워 리스트가 비어 있습니다" />
                  )}
                </TabPane>
              </Tabs>
            </div>
          )}
        </Card>
      </div>

      <style jsx>
        {`
          .responsive {
            width: 700px;
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
