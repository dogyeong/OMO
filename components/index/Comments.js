import {
  Avatar,
  Row,
  Col,
  Input,
  Button,
  Divider,
  Form,
  Space,
  Comment,
  Tooltip,
  List,
  Popconfirm,
} from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function Comments({ auth, postId, comments, handleAddComment, handleDeleteComment }) {
  const [form] = Form.useForm()

  const onFinish = (data) => {
    handleAddComment(postId, data.text)
    form.resetFields()
  }

  const formatTimeCreated = (time) => {
    const date = new Date(time)
    return formatDistanceToNow(date, { includeSeconds: true, addSuffix: true, locale: ko })
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Divider style={{ margin: '12px 0' }} />
      {/* Comments */}
      {comments.length > 0 && (
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment) => (
            <li>
              <Comment
                actions={
                  auth.user._id === comment.postedBy._id
                    ? [
                        <Popconfirm
                          placement="right"
                          title="삭제하시겠습니까?"
                          onConfirm={() => handleDeleteComment(postId, comment)}
                          okText="삭제"
                          cancelText="취소"
                          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                          <span>삭제</span>
                        </Popconfirm>,
                      ]
                    : []
                }
                author={
                  <Link href="/">
                    <a>{comment.postedBy.name}</a>
                  </Link>
                }
                avatar={comment.postedBy.avatar}
                content={comment.text}
                datetime={formatTimeCreated(comment.createdAt)}
              />
            </li>
          )}
        />
      )}

      {/* Add Comment */}
      <Row justify="center" align="middle">
        <Col sm={2} xs={3} style={{ textAlign: 'center' }}>
          <Avatar src={auth.user.avatar} />
        </Col>
        <Col sm={22} xs={21}>
          <Form form={form} size="middle" onFinish={onFinish}>
            <Row>
              <Col flex="auto">
                <Form.Item name="text" style={{ margin: 0 }}>
                  <Input type="text" placeholder="댓글 달기" allowClear />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item style={{ margin: 0 }}>
                  <Button type="link" htmlType="submit">
                    게시
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <style jsx>{`
        :global(.ant-comment-avatar img) {
          object-fit: cover;
        }
      `}</style>
    </Space>
  )
}
