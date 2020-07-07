import { Card, Avatar } from 'antd'

export default function NewPost({ auth, text, image, handleChange }) {
  return <Card title={<Avatar src={auth.user.avatar} />}></Card>
}
