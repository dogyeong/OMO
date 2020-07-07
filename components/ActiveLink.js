import { useRouter } from 'next/router'

const ActiveLink = ({ href, children }) => {
  const router = useRouter()

  ;(function prefetchPages() {
    if (typeof window !== 'undefined') {
      router.prefetch(router.pathname)
    }
  })()

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  const isCurrentPath = router.pathname === href || router.asPath === href

  return (
    <React.Fragment>
      <a href={href} onClick={handleClick}>
        {children}
      </a>
      <style jsx>{`
        a {
          color: ${isCurrentPath ? '#FFF' : 'rgba(255, 255, 255, 0.65)'} !important;
        }
        a:hover {
          color: #fff !important;
        }
      `}</style>
    </React.Fragment>
  )
}

export default ActiveLink
