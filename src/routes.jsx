import { Blog } from './pages/Blog.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'

import { useLoaderData } from 'react-router-dom'
import { getPosts } from './api/posts.js'
import { getUserInfo } from './api/users.js'
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'

export const routes = [
  {
    path: '/',
    loader: async () => {
      const queryClient = new QueryClient()
      const author = ''
      const sortBy = 'createdAt'
      const sortOrder = 'descending'

      const posts = await getPosts({ author, sortBy, sortOrder })

      await queryClient.prefetchQuery({
        queryKey: ['posts', { author, sortBy, sortOrder }],
        queryFn: () => getPosts({ author, sortBy, sortOrder }),
      })

      const uniqueAuthors = posts
        .map((post) => post.author)
        .filter((value, index, array) => array.indexOf(value) === index)

      for (const userId of uniqueAuthors) {
        await queryClient.prefetchQuery({
          queryKey: ['users', userId],
          queryFn: () => getUserInfo(userId),
        })
      }

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
