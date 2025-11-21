import { Blog } from './pages/Blog.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'

import { useLoaderData } from 'react-router-dom'

// import { getUserInfo } from './api/users.js'

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'

// import { ViewPost } from './pages/ViewPost.jsx'

export const routes = [
  {
    path: '/',
    loader: async () => {
      const queryClient = new QueryClient()

      return dehydrate(queryClient)
    },
    Component() {
      const dehydratedState = useLoaderData()
      return (
        <HydrationBoundary state={dehydratedState}>
          <Blog />
        </HydrationBoundary>
      )
    },
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  // {
  //   path: '/posts/:postId/:slug?',
  //   loader: async ({ params }) => {
  //     const postId = params.postId
  //     const queryClient = new QueryClient()

  //     await queryClient.prefetchQuery({
  //       queryKey: ['post', postId],
  //       queryFn: () => post,
  //     })
  //     if (post?.author) {
  //       await queryClient.prefetchQuery({
  //         queryKey: ['users', post.author],
  //         queryFn: () => getUserInfo(post.author),
  //       })
  //     }
  //     return { dehydratedState: dehydrate(queryClient), postId }
  //   },
  //   Component() {
  //     const { dehydratedState, postId } = useLoaderData()
  //     return (
  //       <HydrationBoundary state={dehydratedState}>
  //         <ViewPost postId={postId} />
  //       </HydrationBoundary>
  //     )
  //   },
  // },
]

// import { Blog } from './pages/Blog.jsx'
// import { Signup } from './pages/Signup.jsx'
// import { Login } from './pages/Login.jsx'

// import { useLoaderData } from 'react-router-dom'
// import { getPosts } from './api/posts.js'
// import { getUserInfo } from './api/users.js'
// import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'

// export const routes = [
//   {
//     path: '/',
//     loader: async () => {
//       const queryClient = new QueryClient()
//       const author = ''
//       const sortBy = 'createdAt'
//       const sortOrder = 'descending'

//       // single fetch that also seeds the cache
//       const posts = await queryClient.fetchQuery({
//         queryKey: ['posts', { author, sortBy, sortOrder }],
//         queryFn: () => getPosts({ author, sortBy, sortOrder }),
//       })

//       const uniqueAuthors = [...new Set(posts.map(p => p.author))]

//       await Promise.all(
//         uniqueAuthors.map((userId) =>
//           queryClient.prefetchQuery({
//             queryKey: ['users', userId],
//             queryFn: () => getUserInfo(userId),
//           })
//         )
//       )

//       return dehydrate(queryClient)
//     },
//     Component() {
//       const dehydratedState = useLoaderData()
//       return (
//         <HydrationBoundary state={dehydratedState}>
//           <Blog />
//         </HydrationBoundary>
//       )
//     },
//   },
//   { path: '/signup', element: <Signup /> },
//   { path: '/login', element: <Login /> },
// ]
