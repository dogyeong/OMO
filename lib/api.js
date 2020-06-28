import axios from 'axios'

export const getUser = async (userId) => {
  const { data } = await axios.get(`/api/users/profile/${userId}`)
  return data
}
