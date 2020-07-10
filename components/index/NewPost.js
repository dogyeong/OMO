import { Card, Avatar, Space, Input, Upload, Button } from 'antd'
import { PlusOutlined, PushpinOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'

export default function NewPost({
  auth,
  text,
  image,
  handleText,
  handleImage,
  hasImage,
  isAddingPost,
  handleAddPost,
}) {
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (image) {
      setFileList([
        {
          uid: '-1',
          url: URL.createObjectURL(image),
        },
      ])
    } else {
      setFileList([])
    }
  }, [image])

  return (
    <Card
      title={
        <Space>
          <Avatar src={auth.user.avatar} />
          <span>{auth.user.name}</span>
        </Space>
      }
      actions={[
        <Button block type="link" disabled={!text || isAddingPost} onClick={handleAddPost}>
          {isAddingPost ? '게시 중' : '게시'}
        </Button>,
      ]}
      style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.TextArea
          placeholder="무슨 음식을 드셨나요?"
          allowClear
          autoSize
          maxLength={200}
          rows="3"
          onChange={handleText}
          value={text}
          name="text"
        />
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          name="image"
          beforeUpload={handleImage}
          onRemove={() => handleImage(null)}
          showUploadList={{ showPreviewIcon: false }}
          fileList={fileList}
          accept="image/*"
        >
          {hasImage ? null : (
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">사진 추가</div>
            </div>
          )}
        </Upload>
      </Space>

      <style jsx>{`
        :global(textarea.ant-input) {
          min-height: 80px !important;
        }
      `}</style>
    </Card>
  )
}
