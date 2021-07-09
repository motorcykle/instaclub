import React, { useEffect, useRef, useState } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import { UploadIcon } from '@heroicons/react/solid';
import db, { auth, storage } from '../firebase';
import firebase from 'firebase';
import { selectUserInfo } from '../features/appSlice';
import { useAuthState } from 'react-firebase-hooks/auth';
import './UploadSection.css'
import { useSelector } from 'react-redux';

const UploadSection = () => {
  const [user] = useAuthState(auth);
  const userInfo = useSelector(selectUserInfo)
  const [mediaBlob, setMediaBlob] = useState(null)
  const [recordState, setRecordState] = useState(null);
  const captionRef = useRef(null)
  const audioRef = useRef(null);
  

  function recordToggle () {
    if (recordState !== 'start') {
      setRecordState(RecordState.START);
    } else {
      setRecordState(RecordState.STOP);
    }
  }

  const onStop = (audioData) => {
    setMediaBlob(audioData)
  }

  function uploadPost (e) {
    e.preventDefault();
    const postRef = db.collection('posts');
    if (user && mediaBlob && userInfo) {
      postRef
      .add({
        caption: captionRef.current.value,
        comments: [],
        likes: [],
        user: {
          uid: user.uid,
          username: userInfo.username,
          profile_img: userInfo.profile_img
        },
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(data => {
        data.get().then(doc => {
          storage
            .ref(`Post Recordings/${userInfo?.uid}/${doc.id}`)
            .put(mediaBlob.blob)
            .then(data => data.ref.getDownloadURL()
            .then(url => {
              postRef.doc(doc.id).update({ recording: url})

              e.target.reset()
              setMediaBlob(null)
              setRecordState(RecordState.NONE);
              audioRef.current.src = "";
              
            }))
          
        })
      })
      .catch(err => alert(err))
    }
    
  }


  return (
    <div className="rounded-2xl p-5 bg-gray-300 grid grid-cols-4 gap-4">
      <button onClick={recordToggle} className="bg-gray-100 p-2 rounded-full col-span-4 sm:col-span-1 focus:outline-none">{recordState !== 'start' ? 'Record' : 'Stop Recording'}</button>
      <audio src={mediaBlob?.url} controls autoPlay controlsList="nodownload" className="w-full grid col-span-4 sm:col-span-3 focus:outline-none" ref={audioRef} />
      <AudioReactRecorder state={recordState} onStop={onStop} />
      <form onSubmit={uploadPost} className="flex col-span-4 space-x-4 items-center">
        <textarea maxLength="256" ref={captionRef} className="flex-grow p-2 focus:outline-none rounded-xl"></textarea>
        <button className="bg-gray-100 p-4 rounded-full">
          <UploadIcon className="h-6 text-gray-500" />
        </button>
      </form>
    </div>
  );
}

export default UploadSection;
