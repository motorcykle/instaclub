import React, { useEffect, useRef, useState } from 'react';
import { HeartIcon, MicrophoneIcon, PlayIcon } from '@heroicons/react/outline';
import { HeartIcon as Liked,  } from '@heroicons/react/solid';
import Loader from 'react-loader-spinner';
import PostComment from './PostComment';

const Post = ({ upload }) => {
  const [recordingStatus, setRecordingStatus] = useState('stopped');
  const audioRef = useRef(null)

  function recordingToggle () {
    if (recordingStatus == 'stopped') {
      audioRef.current.play();
      setRecordingStatus('playing')
    } else {
      audioRef.current.pause()
      setRecordingStatus('stopped')
    }
  }


  return (
    <div className="border-2 p-4 rounded-3xl w-full sm:w-4/6">
      <div className="post__container grid grid-cols-4 gap-3">

        <div className="post__content col-span-4 md:col-span-3">
          <div className="post__audio h-24 bg-gray-100 rounded-xl mb-2 cursor-pointer flex items-center justify-center" onClick={recordingToggle}>
            <audio src={upload.recording} ref={audioRef} onPause={() => setRecordingStatus('stopped')} />
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
            <button className="p-2 rounded-xl bg-gray-100 flex-grow">
              <HeartIcon className="h-7 text-gray-400 mx-auto" />
            </button>
            <button className="p-2 rounded-xl bg-gray-100 text-center flex-grow">
              <MicrophoneIcon className="h-7 text-gray-400 mx-auto" />
            </button>
          </div>
          <div className="mt-3">
            <div className="flex justify-between">
              <h4 className="font-semibold text-sm">@kyliejenner</h4>
              <p className="opacity-50 text-xs">ons 7 juni</p>
            </div>
            <p className="mt-1 mb-4">{upload.caption}</p>
          </div>
          
        </div>

        <div className="post__comments flex flex-col items-center col-span-4 md:col-span-1">
          <p className="self-start mb-2 text-gray-400">Comments </p>
        
          <PostComment comment={upload} />
        </div>

      </div>
    </div>
  );
}

export default Post;
