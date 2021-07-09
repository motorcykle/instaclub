import React, { useRef, useState } from 'react';
import db, { auth } from '../firebase';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';

import './Auth.css'

const Auth = () => {
  const [showingOption, setShowingOption] = useState('signup')
  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  function signIn (e) {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password).catch(err => alert(err))
  }

  function signUp (e) {
    e.preventDefault();

    db
      .collection('users')
      .where('username', '==', usernameRef.current.value.toLowerCase())
      .get()
      .then(data => {
        const exists = data.docs.length;
        
        if (!exists) {
          auth
            .createUserWithEmailAndPassword(email, password)
            .then(data => {
              db
                .collection('users')
                .doc(data.user.uid).set({
                  uid: data.user.uid,
                  name: nameRef.current.value,
                  username: usernameRef.current.value.toLowerCase(),
                  followers: [],
                  following: [],
                  profile_img: "https://i.stack.imgur.com/y9DpT.jpg"
                })
            })
        } else {
          throw 'USERNAME IS IN USE'
        }
      
      })
      .catch(err => alert(err))

  }

  return (
    <div className="auth h-screen grid place-items-center">
      <div className="auth__container text-center px-2">
        <div className="auth__text mb-8">
          <h1 className="font-medium text-4xl text-gray-700 animate-pulse ">Insta<span className="font-bold">Club</span></h1>
          <p className=" text-2xl text-gray-500">
            When Instagram merges with Clubhouse.
          </p>
        </div>
        <div className="auth__options">
          <div className="auth__signup mb-3">
            <button onClick={() => setShowingOption('signup')} className={`py-2 px-8 w-full bg-gray-800 rounded-md text-gray-100 font-medium ${showingOption == 'signup' && 'opacity-50 cursor-default'}`}>Sign Up</button>
            
            {showingOption == 'signup' && (
              <form onSubmit={signUp} className="flex flex-col space-y-2 mt-3">
                <input type="text" name="fullname" placeholder="Full name" className="" required ref={nameRef}/>
                <input type="text" name="username" placeholder="Choose a username" className="" required ref={usernameRef} />
                <input type="email" name="email" placeholder="Email address" className="" required onChange={({target}) => setEmail(target.value)} value={email}/>
                <input type="password" name="password" minLength="8" required placeholder="Password (8 characters)" className="" onChange={({target}) => setPassword(target.value)} value={password}/>
                <button type="submit" className="rounded-full w-max self-center animate-pulse">
                  <ArrowCircleRightIcon className="h-10 text-gray-800" />
                </button>
              </form>
            )}
            
          </div>
          <div className="auth__signin">
            <button onClick={() => setShowingOption('signin')} className={`py-2 px-8 w-full bg-gray-800 rounded-md text-gray-100 font-medium ${showingOption == 'signin' && 'opacity-50 cursor-default'}`}>Sign In</button>
            
            {showingOption == 'signin' && (
              <form onSubmit={signIn} className="flex flex-col space-y-2 mt-3">
                <input type="email" name="email" placeholder="Email address" className="" required onChange={({target}) => setEmail(target.value)} value={email}/>
                <input type="password" name="password" minLength="8" required placeholder="Password (8 characters)" className="" onChange={({target}) => setPassword(target.value)} value={password}/>
                <button type="submit" className="rounded-full w-max self-center animate-pulse">
                  <ArrowCircleRightIcon className="h-10 text-gray-800" />
                </button>
              </form>
            )}
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
