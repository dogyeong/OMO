import { Card, Avatar, Space, Divider, Button, Badge, Row, Col, Popconfirm } from 'antd'
import { LikeOutlined, CommentOutlined, QuestionCircleOutlined, LikeFilled } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Post({ auth, post, isDeletingPost, handleDeletePost, handleToggleLike }) {
  const [liked, setLiked] = useState(false)
  const [numLikes, setNumLikes] = useState(0)
  const [comments, setComments] = useState([])

  useEffect(() => {
    setLiked(post.likes.includes(auth.user._id))
    setNumLikes(post.likes.length)
  }, [post])

  const isPostCreator = post.postedBy._id === auth.user._id

  return (
    <Card
      title={
        <Space>
          <Avatar src={post.postedBy.avatar} />
          <div>
            <Link href={`/profile/${post.postedBy._id}`}>
              <a style={{ color: 'rgba(0,0,0,0.85)' }}>{post.postedBy.name}</a>
            </Link>
            <div className="createdAt">{post.createdAt}</div>
          </div>
        </Space>
      }
      extra={
        isPostCreator ? (
          <Popconfirm
            placement="bottomRight"
            title="삭제하시겠습니까?"
            onConfirm={() => handleDeletePost(post)}
            okText="삭제"
            cancelText="취소"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            disabled={isDeletingPost}
          >
            <Button type="text" shape="rounded">
              삭제
            </Button>
          </Popconfirm>
        ) : null
      }
      style={{ backgroundColor: 'rgba(255,255,255,0.85)', marginTop: '1.25em' }}
    >
      <p>{post.text}</p>
      <img src={post.image} style={{ width: '100%' }} />
      <Divider />
      <Row>
        <Col span={12}>
          <Button
            shape="rounded"
            type="text"
            block
            onClick={() => handleToggleLike(post)}
            style={{ color: liked ? '#108ee9' : 'rgba(0,0,0,0.65)' }}
          >
            <Badge
              showZero
              count={numLikes}
              overflowCount={99}
              offset={[10, -5]}
              style={{ backgroundColor: '#bfbfbf' }}
            >
              {liked ? <LikeFilled style={{ color: '#108ee9' }} /> : <LikeOutlined />} 좋아요
            </Badge>
          </Button>
        </Col>
        <Col span={12}>
          <Button shape="rounded" type="text" block>
            <Badge
              showZero
              count={comments.length}
              overflowCount={99}
              offset={[10, -5]}
              style={{ backgroundColor: '#bfbfbf' }}
            >
              <CommentOutlined /> 댓글 달기
            </Badge>
          </Button>
        </Col>
      </Row>

      <style jsx>{`
        .createdAt {
          font-size: 0.8rem;
          color: #666;
        }
      `}</style>
    </Card>
  )
}
