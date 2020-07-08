import { useState, useEffect } from 'react'
import { getUserFeed, followUser } from '../../lib/api'
import { Space, Avatar, Button, message } from 'antd'
import Link from 'next/link'
import { UserAddOutlined } from '@ant-design/icons'

export default function UserFeed({ auth }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    ;(function () {
      getUserFeed(auth.user._id).then((users) => setUsers(users))
    })()
  }, [])

  const handleFollow = (user, userIndex) => {
    followUser(user._id)
      .then((user) => {
        const updatedUsers = [...users.slice(0, userIndex), ...users.slice(userIndex + 1)]
        setUsers(updatedUsers)
        message.success(`${user.name} 팔로우`)
      })
      .catch((err) => message.error(`${err.message}`))
  }

  return (
    <React.Fragment>
      <div className="header">
        <h2>추천 사용자</h2>
      </div>
      <ul className="list">
        {users.map((user, idx) => (
          <li className="list-item" key={user._id}>
            <Space>
              <Avatar src={user.avatar} />
              <Link href={`/profile/${user._id}`}>
                <a className="name">{user.name}</a>
              </Link>
            </Space>
            <Button
              type="text"
              shape="circle"
              icon={<UserAddOutlined />}
              onClick={() => handleFollow(user, idx)}
            />
          </li>
        ))}
      </ul>
      <div></div>

      <style jsx>{`
        .header {
          padding: 0.5rem;
          border-bottom: 1px solid #bfbfbf;
          margin-bottom: 0.5em;
        }

        .header h2 {
          font-size: 1.25rem;
          margin: 0;
        }

        :global(aside.ant-layout-sider) {
          background-color: transparent;
          margin-left: 60px;
        }

        .list {
          list-style: none;
          padding: 0;
        }
        .list-item {
          padding: 1rem 0.5rem;
          margin-bottom: 0.5em;
          display: flex;
          justify-content: space-between;
        }
        .list-item:hover {
          background-color: #d6e4ff;
          border-radius: 6px;
        }
        .name {
          color: rgba(0, 0, 0, 0.85);
        }
        .name:hover {
          text-decoration: underline;
        }
        @media screen and (max-width: 800px) {
          :global(aside.ant-layout-sider) {
            display: none;
          }
        }
      `}</style>
    </React.Fragment>
  )
}
