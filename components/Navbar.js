import { Menu, Button } from 'antd'
import Link from 'next/link'
import ActiveLink from './ActiveLink'
import { signoutUser } from '../lib/auth'

export default function Navbar({ pageProps }) {
  const { user = {} } = pageProps.auth || {}

  return (
    <React.Fragment>
      <div className="responsive">
        <div
          className="logo"
          style={{
            width: '120px',
            height: '31px',
            color: 'white',
            margin: '16px 28px 16px 0',
            lineHeight: '31px',
          }}
        >
          <Link href="/">
            <a style={{ fontSize: '1.25rem', color: 'white' }}>오늘 모목지?</a>
          </Link>
        </div>

        {user._id ? (
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1" style={{ backgroundColor: 'transparent' }}>
              <ActiveLink href={`/profile/${user._id}`}>프로필</ActiveLink>
            </Menu.Item>
            <Menu.Item key="2" style={{ backgroundColor: 'transparent' }}>
              <div onClick={signoutUser}>로그아웃</div>
            </Menu.Item>
          </Menu>
        ) : (
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="3" style={{ backgroundColor: 'transparent' }}>
              <ActiveLink href="/signin">로그인</ActiveLink>
            </Menu.Item>
            <Menu.Item key="4" style={{ backgroundColor: 'transparent' }}>
              <ActiveLink href="/signup">계정 생성</ActiveLink>
            </Menu.Item>
          </Menu>
        )}
      </div>
      <style jsx>{`
        .responsive {
          width: 100%;
          max-width: 1280px;
          padding: 0 40px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
        }

        @media screen and (max-width: 700px) {
          .responsive {
            width: 100%;
            padding: 0 12px;
          }
        }
      `}</style>
    </React.Fragment>
  )
}
