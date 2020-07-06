import { deleteUser } from '../../lib/api'
import { signoutUser } from '../../lib/auth'
import { Popconfirm, Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

export default function DeleteUser({ user }) {
  const handleDeleteUser = () => {
    deleteUser(user._id)
      .then(() => {
        signoutUser()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Popconfirm
      title="삭제하시겠습니까？"
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      cancelText="취소"
      okText="삭제"
      onConfirm={() => handleDeleteUser()}
    >
      <Button danger>계정 삭제</Button>
    </Popconfirm>
  )
}
