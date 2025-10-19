import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'
import { getPostById } from '../api/posts.js'
import { useEffect, useState } from 'react'
import { postTrackEvent } from '../api/events.js'

import { getUserInfo } from '../api/users.js'
import { Helmet } from 'react-helmet-async'
export function ViewPost({ postId }) {
  const [session, setSession] = useState()

  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })

  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)
    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [])

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })
  const post = postQuery.data

  const userInfoQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post.author),
    enabled: Boolean(post?.author),
  })

  const author = userInfoQuery.data

  return (
    <>
      <Helmet>
        <title>{post?.title ?? 'Post'}</title>
      </Helmet>
      <Header />
      {post && <Post {...post} author={author} />}
    </>
  )
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}

export default function ViewPostWrapper(props) {
  return <ViewPost {...props} />
}
