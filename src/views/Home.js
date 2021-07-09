import React, { useState } from 'react';

import UploadSection from '../components/UploadSection';
import Feed from '../components/Feed';

const Home = () => {
  const [uploads] = useState([
    {
      caption: 'Hello this is a caption. 🔥',
      recording: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/1860-Scott-Au-Clair-de-la-Lune-05-09.ogg',
      comments: [{ user: { username: "@testingCC1" }, recording: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/1860-Scott-Au-Clair-de-la-Lune-05-09.ogg' }],
      user: { username: "@testing" }, // ref
      likes: [],
      id: "wefwef"
    }
  ])

  return (
    <div className="flex-1">
      <div className="container pt-5">
        <UploadSection />
        <Feed uploads={uploads} />
      </div>
    </div>
  );
}

export default Home;
