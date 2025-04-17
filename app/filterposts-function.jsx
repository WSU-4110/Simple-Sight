import { isToday } from 'date-fns';

export function filterPosts(posts, filter) {
  if (filter === 'Today') {
    return posts.filter((post) => post.createdAt && isToday(post.createdAt.toDate()));
  }
  return posts;
}