import { authInitialProps } from '../lib/auth'
import { getAuthUser, updateUser } from '../lib/api'
import { useEffect, useState } from 'react'
import Router from 'next/router'
import { Spin, Card, Avatar, Layout, Button, Space, Form, Input, Upload, message, Modal } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
const { TextArea } = Input

export default function EditProfile({ auth }) {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [fileList, setFileList] = useState([])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    ;(async function () {
      getAuthUser(auth.user._id)
        .then((user) => setUser({ ...user }))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false))
    })()
  }, [])

  const beforeUpload = (file, fileList) => {
    setFile(file)
    setFileList(fileList)
    setPreview(URL.createObjectURL(file))
    return false
  }

  const handleRemove = () => {
    setFile(null)
    setFileList([])
    setPreview(null)
  }

  const showError = (err) => {
    const error = (err.response && err.response.data) || err.message
    message.error(error)
  }

  const modal = (updatedUser) =>
    Modal.success({
      title: '수정 완료',
      okText: '확인',
      onOk() {
        Router.push(`/profile/${updatedUser._id}`)
      },
    })

  const onFinish = (data) => {
    // 업로드할 폼 데이터 만들기
    const formData = new FormData()
    for (let key in data) {
      formData.append(key, data[key])
    }
    file && formData.append('avatar', file)

    setIsSaving(true)
    updateUser(auth.user._id, formData)
      .then((updatedUser) => modal(updatedUser))
      .catch(showError)
      .finally(() => setIsSaving(false))
  }

  return (
    <Layout style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: 640, marginTop: 32 }} title="프로필 수정">
        {isLoading ? (
          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Spin size="large" />
          </Space>
        ) : (
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} size="large" onFinish={onFinish}>
            <Form.Item wrapperCol={{ offset: 4, span: 26 }}>
              <Space size="middle">
                <Avatar src={`${preview || user.avatar}`} size={50} />
                <Upload
                  name="avatar"
                  accept="image/*"
                  beforeUpload={beforeUpload}
                  onRemove={handleRemove}
                  fileList={fileList}
                  listType="text"
                >
                  <Button>
                    <UploadOutlined /> 프로필 사진 업로드
                  </Button>
                </Upload>
              </Space>
            </Form.Item>

            <Form.Item
              label="이름"
              name="name"
              initialValue={user.name}
              rules={[{ required: true, message: '이름을 4~10자 입력해 주세요.', min: 4, max: 10 }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="이메일"
              name="email"
              initialValue={user.email}
              rules={[{ required: true, message: '이메일을 입력해 주세요.', type: 'email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="소개" name="about" initialValue={user.about} rules={[{ required: false }]}>
              <TextArea />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 26 }} style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" disabled={isSaving} block>
                {isSaving ? '저장중..' : '저장'}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </Layout>
  )
}

EditProfile.getInitialProps = authInitialProps(true)
