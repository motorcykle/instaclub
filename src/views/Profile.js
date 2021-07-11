import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Feed from '../components/Feed';
import { selectUserInfo } from '../features/appSlice';
import db, { auth, storage } from '../firebase';

const Profile = () => {
  const { username } = useParams();
  const [snapshot] = useCollection(db.collection('users').where("username", '==', username));
  const [userOfPage, setUserOfPage] = useState(null);
  const [posts, setPosts] = useState([]);
  const userInfo = useSelector(selectUserInfo);
  const [user] = useAuthState(auth);
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState(null);

  const isUser = username === userInfo?.username;

  useEffect(() => { 
    setUserOfPage(snapshot?.docs[0].data()) 
  }, [snapshot])

  useEffect(() => { 
    if (userOfPage) {
      const unsub = db.collection('posts').orderBy('timestamp', 'desc').where('user.uid', '==', userOfPage.uid).onSnapshot(data => {
        setPosts(data.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      })
      return unsub
    }
  }, [userOfPage])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileImg])

  function changeProfileImg (url) {
    db
      .collection('users')
      .doc(user.uid)
      .update({
        profile_img: url
      })
  }

  function followToggle () {
    const usersRef = db.collection('users');

    if (userInfo && userOfPage) {

      if (userInfo?.following?.includes(userOfPage?.uid)) {
        // if we follow this user already
        usersRef.doc(userOfPage?.uid).update({
          followers: firebase.firestore.FieldValue.arrayRemove(userInfo?.uid)
        });
        
        usersRef.doc(userInfo?.uid).update({
          following: firebase.firestore.FieldValue.arrayRemove(userOfPage?.uid)
        });
      } else {
        // we dont follow this user already
        usersRef.doc(userOfPage?.uid).update({
          followers: firebase.firestore.FieldValue.arrayUnion(userInfo?.uid)
        });
        
        usersRef.doc(userInfo?.uid).update({
          following: firebase.firestore.FieldValue.arrayUnion(userOfPage?.uid)
        });
      }

    }
  }

  return (
    <div className="profile flex-1">
      <div className="profile__container container pt-5">

        <div className="profile__userInfo bg-gray-800 rounded-2xl flex items-center justify-center flex-col text-gray-300 py-10 px-2">
          
          <div className="profileImg__container overflow-hidden h-40 w-40 rounded-full " onClick={() => isUser && fileInputRef.current.click()} >
            <input type="file" name="" className="hidden" ref={fileInputRef} onChange={({target}) => setProfileImg(target.files[0])} />
            <img src={userOfPage?.profile_img} alt="" className="w-full h-full object-cover" />
          </div>

          <h2 className="text-3xl mt-4">{userOfPage?.name}</h2>

          <p className="font-bold">@{userOfPage?.username}</p>

          <div className="flex space-x-2 sm:space-x-7 text-center my-5">
            <div className="followers">
              <p>{userOfPage?.followers.length || '0'}</p> <small className="font-bold">FOLLOWERS</small>
            </div>
            <div className="following">
              <p>{userOfPage?.following.length || '0'}</p> <small className="font-bold">FOLLOWING</small>
            </div>
            <div className="uploads">
              <p>{posts.length}</p> <small className="font-bold">UPLOADS</small>
            </div>
          </div>

          {!isUser && 
          <button onClick={followToggle} className="bg-gray-300 text-gray-700 py-2 px-5 rounded-3xl">
            {userInfo?.following?.includes(userOfPage?.uid) ? 'Unfollow' : 'Follow'}
          </button>
          }


        </div>
        
        <Feed posts={posts} />
        

      </div>
    </div>
  );
}

export default Profile;
