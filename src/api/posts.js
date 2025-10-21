export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}

export async function getPostById(postId) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`)
  return await res.json()
}

export const createPost = async (token, post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  })
  return await res.json()
}

// import { getJSON } from './http.js'

// const BASE = import.meta.env.VITE_BACKEND_URL

// export const getPosts = async (queryParams) => {
//   if (!BASE) throw new Error('VITE_BACKEND_URL is undefined')
//   const qs = new URLSearchParams(queryParams)
//   return getJSON(`${BASE}/posts?${qs.toString()}`)
// }

// export const createPost = async (token, post) => {
//   if (!BASE) throw new Error('VITE_BACKEND_URL is undefined')
//   return getJSON(`${BASE}/posts`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(post),
//   })
// }
