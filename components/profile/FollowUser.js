import { Button } from 'antd'
import { followUser, unfollowUser } from '../../lib/api'

export default function FollowUser({ isFollowing, toggleFollow }) {
  const request = isFollowing ? unfollowUser : followUser

  return <Button onClick={() => toggleFollow(request)}>{isFollowing ? '언팔로우' : '팔로우'}</Button>
}
