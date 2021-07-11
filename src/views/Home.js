import React, { useEffect, useState } from 'react';

import UploadSection from '../components/UploadSection';
import Feed from '../components/Feed';
import db from '../firebase';
import { selectUserInfo } from '../features/appSlice';
import { useSelector } from 'react-redux';

const Home = () => {
  const userInfo = useSelector(selectUserInfo);
  const [posts, setPosts] = useState();

  useEffect(() => {
    if (userInfo && userInfo?.following?.length > 0) {
      const unsub = db
        .collection('posts')
        .where('user.uid', 'in', userInfo?.following)
        .orderBy('timestamp', 'desc')
        .onSnapshot(querySnapshot => { 
          setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
      return unsub;
    }
  }, [userInfo]);

  return (
    <div className="flex-1">
      <div className="container pt-5">
        <UploadSection />
        <Feed posts={posts} />
      </div>
    </div>
  );
}

export default Home;
