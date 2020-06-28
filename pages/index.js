import { authInitialProps } from '../lib/auth'
import Link from 'next/link'

export default function Index() {
  return (
    <div>
      <Link href="/signup">
        <a>signup</a>
      </Link>
      index dasdsad adad
    </div>
  )
}

Index.getInitialProps = authInitialProps()
