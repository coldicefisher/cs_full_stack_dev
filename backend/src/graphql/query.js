import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
} from '../services/posts.js'

export const querySchema = `#graphql
  input PostsOptions {
    sortBy: String
    sortOrder: String
  }
  type Query {
    test: String
    posts(options: PostsOptions): [Post!]
    postsByAuthor(username: String!, options: PostsOptions): [Post!]
    postsByTag(tag: String!, options: PostsOptions): [Post!]
    postsById(id: ID!): Post
  }`
export const queryResolver = {
  Query: {
    test: () => {
      return 'Hello World from GraphQL!'
    },
    posts: async (parent, { options }) => {
      return await listAllPosts(options)
    },
    postsByAuthor: async (parent, { username }) => {
      return await listPostsByAuthor(username)
    },
    postsByTag: async (parent, { tag }) => {
      return await listPostsByTag(tag)
    },
    postsById: async (parent, { id }) => {
      return await getPostById(id)
    },
  },
}
