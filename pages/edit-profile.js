import { authInitialProps } from '../lib/auth'

export default function EditProfile() {
  return <div>EditProfile</div>
}

EditProfile.getInitialProps = authInitialProps(true)
