export const userSchema = `#graphql
  type User {
    
    username: String!
    posts: [Post!]
  }
`

export const userResolver = {
  User: {},
}
