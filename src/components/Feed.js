import React from 'react';
import Post from './Post';

const Feed = ({ posts }) => {
  return (
    <div className="flex flex-col justify-center items-center my-8 space-y-5">
      {posts?.length ? posts?.map(post => <Post key={post.id} post={post} />) : <h1 className="text-xl font-semibold text-gray-400 text-center my-auto">No posts available</h1>}
    </div>
  );
}

export default Feed;
