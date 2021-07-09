import React, { useEffect, useRef, useState } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import { HeartIcon, MicrophoneIcon, PlayIcon } from '@heroicons/react/outline';
import { HeartIcon as Liked,  } from '@heroicons/react/solid';
import Loader from 'react-loader-spinner';
import PostComment from './PostComment';
import { selectUserInfo } from '../features/appSlice';
import { useSelector } from 'react-redux';
import db from '../firebase';
import firebase from 'firebase';

import './Post.css'

const Post = ({ post }) => {
  const [recordingStatus, setRecordingStatus] = useState('stopped');
  const userInfo = useSelector(selectUserInfo);
  const audioRef = useRef(null)

  // comment recording stuff
  const [mediaBlob, setMediaBlob] = useState(null)
  const [recordState, setRecordState] = useState(null);
  const commentAudioRef = useRef(null);
  // -----------------------

  function recordingToggle () {
    if (recordingStatus == 'stopped') {
      audioRef?.current.play();
      setRecordingStatus('playing')
    } else {
      audioRef?.current.pause()
      setRecordingStatus('stopped')
    }
  }

  function likeToggle () {
    const postRef = db.collection('posts').doc(post.id);

    if (userInfo) {
      if (post.likes.includes(userInfo?.uid)) {
        // if we like this post already
        postRef.update({
          likes: firebase.firestore.FieldValue.arrayRemove(userInfo?.uid)
        });
      } else {
        // we dont like this post already
        postRef.update({
          likes: firebase.firestore.FieldValue.arrayUnion(userInfo?.uid)
        });
      }
    }
  }

  //  comment stuff 
  function uploadComment () {
    // const postRef = db.collection('posts');
    // if (user && mediaBlob && userInfo) {
    //   postRef
    //   .add({
    //     caption: captionRef.current.value,
    //     comments: [],
    //     likes: [],
    //     user: {
    //       uid: user.uid,
    //       username: userInfo.username,
    //       profile_img: userInfo.profile_img
    //     },
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp()
    //   })
    //   .then(data => {
    //     data.get().then(doc => {
    //       storage
    //         .ref(`Post Recordings/${userInfo?.uid}/${doc.id}`)
    //         .put(mediaBlob.blob)
    //         .then(data => data.ref.getDownloadURL()
    //         .then(url => {
    //           postRef.doc(doc.id).update({ recording: url})

    //           setMediaBlob(null)
    //           setRecordState(RecordState.NONE);
    //           audioRef.current.src = "";
              
    //         }))
          
    //     })
    //   })
    //   .catch(err => alert(err))
    // }
  }

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
  // -----------------------


  return (
    <div className="border-2 p-4 rounded-3xl w-full sm:w-4/6">
      <div className="post__container grid grid-cols-4 gap-3">

        <div className="post__content col-span-4 md:col-span-3">
          <div className="post__audio h-24 bg-gray-100 rounded-xl mb-2 cursor-pointer flex items-center justify-center" onClick={recordingToggle}>
            <audio src={post.recording} ref={audioRef} onPause={() => setRecordingStatus('stopped')} />
            {recordingStatus == 'playing' ? (
              <>
              <Loader type="Bars" color="#9CA3AF" height={40} width={40}/>
              <Loader type="Bars" color="#9CA3AF" height={40} width={40}/>
              <Loader type="Bars" color="#9CA3AF" height={40} width={40}/>
              <Loader type="Bars" color="#9CA3AF" height={40} width={40}/>
              </>
            ) : (
              <PlayIcon className="h-12 text-gray-400" />
            )}
          </div>
          <div className="btns flex space-x-2 w-full">
            <button onClick={likeToggle} className="p-2 rounded-xl bg-gray-100 flex-grow">
              {post.likes.includes(userInfo?.uid) ? <Liked className="h-7 text-red-400 mx-auto" /> : <HeartIcon className="h-7 text-gray-400 mx-auto" />}
            </button>
            <> {/* * * * * */}
            <button className="p-2 rounded-xl bg-gray-100 text-center flex-grow">
              <MicrophoneIcon className="h-7 text-gray-400 mx-auto" />
            </button>
            <audio src={mediaBlob?.url} controls autoPlay controlsList="nodownload" className="hidden" ref={commentAudioRef} />
            <AudioReactRecorder state={recordState} onStop={onStop} />
            </> {/* * * * * */}
          </div>
          <div className="mt-3">
            <div className="flex items-center space-x-2">
              <div className="profileImg__container overflow-hidden h-5 w-5 rounded-full">
                <img src={post.user.profile_img} alt="" className="h-full w-full" />
              </div>
              <h4 className="font-semibold text-sm flex-1">@{post.user.username}</h4>
              <p className="opacity-50 text-xs">{new Date(Date(post.timestamp)).toDateString()}</p>
            </div>
            <p className="mt-1 mb-4">{post.caption}</p>
          </div>
          
        </div>

        <div className="post__comments flex flex-col items-center col-span-4 md:col-span-1">
          <p className="self-start mb-2 text-gray-400">Comments </p>
          {post?.comments?.map(comment => <PostComment comment={comment} />)}
        </div>

      </div>
    </div>
  );
}

export default Post;
