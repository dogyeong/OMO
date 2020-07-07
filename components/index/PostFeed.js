import { useState, useEffect } from 'react'
import NewPost from './NewPost'
import Post from './Post'

export default function PostFeed({ auth }) {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [posts, setPosts] = useState([])

  const handleText = (event) => {
    if (event.target.name === 'text') {
      setText(event.target.value)
    }
  }

  const handleImage = (file) => {
    setImage(file)
    return file === null
  }

  return (
    <div>
      <NewPost
        auth={auth}
        text={text}
        image={image}
        handleText={handleText}
        handleImage={handleImage}
        hasImage={image !== null}
      />
      {/* Post List */}
    </div>
  )
}
