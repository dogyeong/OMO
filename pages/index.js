import { authInitialProps } from '../lib/auth'
import Link from 'next/link'
import { Button } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'

export default function Index({ auth }) {
  return (
    <React.Fragment>
      {auth.user && auth.user._id ? (
        <div>auth user page</div>
      ) : (
        <div className="landing-container">
          <div className="landing-left">
            <h1 className="landing-title">오늘, 모목지?</h1>
            <p className="landing-text">뭘 먹을지 고민일 때, 한번 둘러보세요!</p>
            <Button type="primary" shape="round" icon={<ArrowRightOutlined />}>
              <Link href="/signin">
                <a style={{ color: 'white', marginLeft: 8 }}>시작하기</a>
              </Link>
            </Button>
          </div>
          <div className="landing-right">sdaasd</div>
        </div>
      )}

      <style jsx>{`
        .landing-container {
          flex: 1;
          align-self: center;
          display: flex;
          justify-content: space-between;
          padding-bottom: 15vh;
        }
        .landing-left {
          flex: 1;
        }
        .landing-title {
          font-size: 3rem;
        }
        .landing-text {
          font-size: 1.25rem;
        }
        .landing-right {
          flex: 1;
        }
      `}</style>
    </React.Fragment>
  )
}

Index.getInitialProps = authInitialProps()
