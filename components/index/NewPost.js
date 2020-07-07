import { Card, Avatar, Space, Input, Upload } from 'antd'
import { PlusOutlined, PushpinOutlined } from '@ant-design/icons'

export default function NewPost({ auth, text, image, handleText, handleImage, hasImage }) {
  return (
    <Card
      title={
        <Space>
          <Avatar src={auth.user.avatar} />
          <span>{auth.user.name}</span>
        </Space>
      }
      actions={[<span>게시</span>]}
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
          // fileList={fileList}
          // onPreview={this.handlePreview}
          // onChange={this.handleChange}
          name="image"
          beforeUpload={handleImage}
          onRemove={() => handleImage(null)}
          showUploadList={{ showPreviewIcon: false }}
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
