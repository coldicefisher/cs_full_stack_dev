import { gql } from '@apollo/client/core/index.js'

const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    title
    contents
    tags
    updatedAt
    createdAt
    author {
      username
    }
  }
`

export const GET_POSTS = gql`
  query getPosts($options: PostsOptions) {
    posts(options: $options) {
      id
      title
      contents
      tags
      updatedAt
      createdAt
      author {
        username
      }
    }
  }
`
// ${POST_FIELDS}
export const GET_POSTS_BY_AUTHOR = gql`
  ${POST_FIELDS}
  query getPostsByAuthor($author: String!, $options: PostsOptions) {
    postsByAuthor(username: $author, options: $options) {
      ...PostFields
    }
  }
`

export const CREATE_POST = gql`
  mutation createPost($title: String!, $contents: String, $tags: [String!]) {
    createPost(title: $title, contents: $contents, tags: $tags) {
      id
      title
    }
  }
`
