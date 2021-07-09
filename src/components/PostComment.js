import { PlayIcon } from '@heroicons/react/solid';
import React, { useRef, useState } from 'react';
import Loader from 'react-loader-spinner';

const PostComment = ({ comment }) => {
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
    <div className="comment py-3 px-4 w-full rounded-xl bg-gray-100 text-center overflow-x-scroll">
      <p className="opacity-50 text-xs">{new Date(Date(comment.timestamp)).toLocaleDateString()}</p>
      <h4 className="font-semibold text-sm">@{comment.user.username}</h4>
      <div className="post__audio py-3 bg-white rounded-xl cursor-pointer flex items-center justify-center mt-3" onClick={recordingToggle}>
        <audio src={comment.recording} ref={audioRef} onPause={() => setRecordingStatus('stopped')} />
        {recordingStatus == 'playing' ? (
          <Loader type="Bars" color="#9CA3AF" height={"1.75rem"} width={"1.75rem"}/>
        ) : (
          <PlayIcon className="h-7 text-gray-400" />
        )}
      </div>
    </div>
  );
}

export default PostComment;
