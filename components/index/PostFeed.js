import { useState, useEffect } from 'react'
import NewPost from './NewPost'
import Post from './Post'

export default function PostFeed({ auth }) {
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [posts, setPosts] = useState([])

  const handleChange = () => {}

  return (
    <div>
      <NewPost auth={auth} text={text} image={image} handleChange={handleChange} />
      {/* Post List */}
    </div>
  )
}
