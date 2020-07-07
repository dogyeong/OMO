import { Button } from 'antd'
import Link from 'next/link'
import { ArrowRightOutlined } from '@ant-design/icons'

export default function Landing() {
  return (
    <React.Fragment>
      <div className="landing-container">
        <div className="landing-left">
          <h1 className="landing-title">오늘, 모목지?</h1>
          <p className="landing-text">뭘 먹을지 고민일 때, 한번 둘러보세요!</p>
          <Link href="/signin">
            <Button type="primary" shape="round" icon={<ArrowRightOutlined />}>
              <a style={{ color: 'white', marginLeft: 8 }}>시작하기</a>
            </Button>
          </Link>
        </div>
        <div className="landing-right">sdaasd</div>
      </div>
      <style jsx>{`
        .landing-container {
          flex: 1;
          align-self: center;
          display: flex;
          flex-direction: row;
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
        @media screen and (max-width: 700px) {
          .landing-container {
            flex-direction: column-reverse;
            padding-bottom: 10vh;
          }
          .landing-left {
            text-align: center;
          }
          .landing-right {
            text-align: center;
            margin-bottom: 40px;
          }
        }
      `}</style>
    </React.Fragment>
  )
}
