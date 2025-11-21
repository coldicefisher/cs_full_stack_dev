import { createUser, loginUser } from '../services/users.js'

export const mutationSchema = `#graphql
  type Mutation {
    signupUser(username: String!, password: String!): User
    loginUser(username: String!, password: String!): String
    createPost(title: String!, contents: String, tags: [String]): Post
  }`

export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      return await createUser({ username, password })
    },
    loginUser: async (parent, { username, password }) => {
      return await loginUser({ username, password })
    },
  },
}
