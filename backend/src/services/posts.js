import { Post } from '../db/models/post.js'
export async function createPost({ title, author, contents, tags }) {
  const post = new Post({ title, author, contents, tags })
  await post.save()
  return post
}
