import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import { HeartIcon, MicrophoneIcon, PauseIcon, PlayIcon } from '@heroicons/react/outline';
import { ArrowRightIcon, HeartIcon as Liked, TrashIcon,  } from '@heroicons/react/solid';
import Loader from 'react-loader-spinner';
import PostComment from './PostComment';
import { selectUserInfo } from '../features/appSlice';
import { useSelector } from 'react-redux';
import db, { storage } from '../firebase';
import firebase from 'firebase';

import './Post.css'

const Post = ({ post }) => {
  const [recordingStatus, setRecordingStatus] = useState('stopped');
  const userInfo = useSelector(selectUserInfo);
  const audioRef = useRef(null)

  // comment recording stuff
  const [recordedCommentStatus, setRecordedCommentStatus] = useState('stopped');
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
    const postRef = db.collection('posts').doc(post.id);
    if (mediaBlob && userInfo) {
      const commentId = uuidv4();
      storage
        .ref(`Comment Recordings/${post?.user?.uid}/${commentId}`)
        .put(mediaBlob.blob)
        .then(data => data.ref.getDownloadURL()
        .then(url => {
          const comment = {
            recording: url,
            user: {
              uid: userInfo.uid,
              username: userInfo.username,
              profile_img: userInfo.profile_img
            },
            timestamp: (new Date()).toUTCString(),
            id: commentId
          }
          postRef.update({
            comments: firebase.firestore.FieldValue.arrayUnion(comment)
          })
          .then(data => {
            deleteRecordedComment();
          })
          .catch(err => {
            alert(err)
          })
        }))
    }
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

  function recordedCommentToggle () {
    if (recordedCommentStatus == 'stopped') {
      commentAudioRef?.current.play();
      setRecordedCommentStatus('playing')
    } else {
      commentAudioRef?.current.pause()
      setRecordedCommentStatus('stopped')
    }
  }

  function deleteRecordedComment () {
    setMediaBlob(null)
    setRecordState(RecordState.NONE);
    commentAudioRef.current.src = "";
  }
  // -----------------------


  return (
    <div className="border-2 p-4 rounded-3xl w-full sm:w-4/6 max-h-80 overflow-y-scroll">
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
            
            {mediaBlob ? (
              <>
              <button onClick={recordedCommentToggle} className="p-2 rounded-xl bg-gray-100 text-center flex-grow">
                {recordedCommentStatus == 'stopped' ? (
                  <PlayIcon className="h-7 text-gray-400 mx-auto" />
                ) : (
                  <PauseIcon className="h-7 text-gray-400 mx-auto" />
                )}
                
              </button>
              <button onClick={deleteRecordedComment} className={`p-2 rounded-xl bg-gray-100 text-center flex-grow hover:bg-red-100`}>
                <TrashIcon className="h-7 text-gray-400 mx-auto" />
              </button>
              <button onClick={uploadComment} className="p-2 rounded-xl bg-green-300 text-center flex-grow">
                <ArrowRightIcon className="h-7 text-gray-100 mx-auto" />
              </button>
              </>
            ) : (
              <button onClick={recordToggle} className="p-2 rounded-xl bg-gray-100 text-center flex-grow">
                <MicrophoneIcon className={`h-7 text-gray-400 mx-auto ${recordState == 'start' && 'text-red-400 animate-ping'}`} />
              </button>
            )}
            <audio src={mediaBlob?.url} controls controlsList="nodownload" className="hidden" ref={commentAudioRef}  onPause={() => setRecordedCommentStatus('stopped')} />
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

        <div className="post__comments flex flex-col items-center col-span-4 md:col-span-1 space-y-3 overflow-scroll">
          <p className="self-start mb-2 text-gray-400">Comments </p>
          {post?.comments?.map(comment => <PostComment key={comment.id} comment={comment} />)}
        </div>

      </div>
    </div>
  );
}

export default Post;
