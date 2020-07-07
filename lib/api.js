import axios from 'axios'

export const getUser = async (userId) => {
  const { data } = await axios.get(`/api/users/profile/${userId}`)
  return data
}

export const followUser = async (followId) => {
  const { data } = await axios.put('/api/users/follow', { followId })
  return data
}

export const unfollowUser = async (followId) => {
  const { data } = await axios.put('/api/users/unfollow', { followId })
  return data
}

export const deleteUser = async (authUserId) => {
  const { data } = await axios.delete(`/api/users/${authUserId}`)
  return data
}

export const getAuthUser = async (authUserId) => {
  const { data } = await axios.get(`/api/users/${authUserId}`)
  return data
}

export const updateUser = async (authUserId, userData) => {
  const { data } = await axios.put(`/api/users/${authUserId}`, userData)
  return data
}

export const getUserFeed = async (authUserId) => {
  const { data } = await axios.get(`/api/users/feed/${authUserId}`)
  return data
}
