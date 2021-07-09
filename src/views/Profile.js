import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Feed from '../components/Feed';
import { selectUserInfo } from '../features/appSlice';
import db, { auth, storage } from '../firebase';

const Profile = () => {
  const { username } = useParams();
  const [snapshot, loading, error] = useCollection(db.collection('users').where("username", '==', username));
  const userInfo = useSelector(selectUserInfo);
  const [user] = useAuthState(auth);
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState(null);

  const isUser = username == userInfo?.username;

  useEffect(() => { console.log(snapshot.docs[0].data()) }, [snapshot])

  useEffect(() => {
    if (profileImg && user) {
      console.log(profileImg)
      storage
      .ref(`Profile Images/${user.uid}`)
      .put(profileImg)
      .then(data => data.ref.getDownloadURL()
      .then(url => {
        changeProfileImg(url)
      }))
    }
  }, [profileImg])

  function changeProfileImg (url) {
    db
      .collection('users')
      .doc(user.uid)
      .update({
        profile_img: url
      })
  }

  return (
    <div className="profile flex-1">
      <div className="profile__container container pt-5">

        <div className="profile__userInfo bg-gray-800 rounded-2xl flex items-center justify-center flex-col text-gray-300 py-10 px-2">
          
          <div className="profileImg__container overflow-hidden h-40 w-40 rounded-full " onClick={() => isUser && fileInputRef.current.click()} >
            <input type="file" name="" className="hidden" ref={fileInputRef} onChange={({target}) => setProfileImg(target.files[0])} />
            <img src={userInfo?.profile_img} alt="" className="w-full h-full object-cover" />
          </div>

          <h2 className="text-3xl mt-4">{userInfo?.name}</h2>

          <p className="font-bold">@{userInfo?.username}</p>

          <div className="flex space-x-2 sm:space-x-7 text-center my-5">
            <div className="followers">
              <p>{userInfo?.followers.length || '0'}</p> <small className="font-bold">FOLLOWERS</small>
            </div>
            <div className="following">
              <p>{userInfo?.following.length || '0'}</p> <small className="font-bold">FOLLOWING</small>
            </div>
            <div className="uploads">
              <p>{userInfo?.uploads?.length || '0'}</p> <small className="font-bold">UPLOADS</small>
            </div>
          </div>

          {!isUser && <button className="bg-gray-300 text-gray-700 py-2 px-5 rounded-3xl">Follow</button>}


        </div>

        <Feed />

      </div>
    </div>
  );
}

export default Profile;
