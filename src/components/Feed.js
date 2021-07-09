import React from 'react';
import Post from './Post';

const Feed = ({ posts }) => {
  return (
    <div className="flex flex-col justify-center items-center my-8 space-y-5">
      {posts?.map(post => <Post key={post.id} post={post} />)}
    </div>
  );
}

export default Feed;
