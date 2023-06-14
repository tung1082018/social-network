import React from "react";
import Post from "./Post";

const PostList = ({
  posts,
  handleDelete,
  handleLike,
  handleUnlike,
  handleComment,
  removeComment,
}) => {
  return (
    <>
      {posts &&
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            handleDelete={handleDelete}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleComment={handleComment}
            removeComment={removeComment}
          />
        ))}
    </>
  );
};

export default PostList;
