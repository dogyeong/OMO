import { useState, useEffect } from 'react'
import NewPost from './NewPost'
import Post from './Post'
import { addPost, getPostFeed, deletePost, likePost, unlikePost, addComment } from '../../lib/api'
import { message } from 'antd'

export default function PostFeed({ auth }) {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [posts, setPosts] = useState([])
  const [isAddingPost, setIsAddingPost] = useState(false)
  const [isDeletingPost, setIsDeletingPost] = useState(false)

  useEffect(() => {
    ;(function () {
      getPostFeed(auth.user._id).then((posts) => setPosts(posts))
    })()
  }, [])

  const handleText = (event) => {
    if (event.target.name === 'text') {
      setText(event.target.value)
    }
  }

  const handleImage = (file) => {
    setImage(file)
    return file === null
  }

  const handleAddPost = () => {
    if (isAddingPost) {
      return
    }
    setIsAddingPost(true)

    const postData = new FormData()
    postData.append('text', text)
    image && postData.append('image', image)

    addPost(auth.user._id, postData)
      .then((postData) => {
        setPosts([postData, ...posts])
        message.success('게시되었습니다')
      })
      .catch((err) => {
        console.error(err)
        message.error('게시 실패')
      })
      .finally(() => {
        setIsAddingPost(false)
        setText('')
        handleImage(null)
      })
  }

  const handleDeletePost = (deletedPost) => {
    setIsDeletingPost(true)
    deletePost(deletedPost._id)
      .then((postData) => {
        const postIndex = posts.findIndex((post) => post._id === postData._id)
        const updatedPosts = [...posts.slice(0, postIndex), ...posts.slice(postIndex + 1)]
        setPosts(updatedPosts)
        message.success('삭제되었습니다')
      })
      .catch((err) => {
        console.error(err)
        message.error('삭제 실패')
      })
      .finally(() => setIsDeletingPost(false))
  }

  const handleToggleLike = (post) => {
    const isPostLiked = post.likes.includes(auth.user._id)
    const sendRequest = isPostLiked ? unlikePost : likePost
    sendRequest(post._id)
      .then((postData) => {
        const postIndex = posts.findIndex((post) => post._id === postData._id)
        const updatedPosts = [...posts.slice(0, postIndex), postData, ...posts.slice(postIndex + 1)]
        setPosts(updatedPosts)
      })
      .catch((err) => console.error(err))
  }

  const handleAddComment = (postId, text) => {
    const comment = { text }
    addComment(postId, comment)
      .then((postData) => {
        const postIndex = posts.findIndex((post) => post._id === postData._id)
        const updatedPosts = [...posts.slice(0, postIndex), postData, ...posts.slice(postIndex + 1)]
        setPosts(updatedPosts)
      })
      .catch((err) => console.log(err))
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
        isAddingPost={isAddingPost}
        handleAddPost={handleAddPost}
      />
      {/* Post List */}
      {posts.map((post) => (
        <Post
          key={post._id}
          auth={auth}
          post={post}
          isDeletingPost={isDeletingPost}
          handleDeletePost={handleDeletePost}
          handleToggleLike={handleToggleLike}
          handleAddComment={handleAddComment}
        />
      ))}
    </div>
  )
}
