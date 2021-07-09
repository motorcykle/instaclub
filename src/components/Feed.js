import React from 'react';
import Post from './Post';

const Feed = ({ uploads }) => {
  return (
    <div className="flex flex-col justify-center items-center my-8">
      {uploads?.map(upload => <Post key={upload.id} upload={upload} />)}
    </div>
  );
}

export default Feed;
