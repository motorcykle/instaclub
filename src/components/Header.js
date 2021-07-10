import { BellIcon, LogoutIcon, UploadIcon, UserCircleIcon } from '@heroicons/react/outline';
import { HomeIcon } from '@heroicons/react/solid';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserInfo } from '../features/appSlice';
import { auth } from '../firebase';
import SearchBar from './SearchBar';

const Header = () => {
  const userInfo = useSelector(selectUserInfo);


  return (
    <div className="shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-3">
        <Link to="/">
          <HomeIcon className="h-5 text-gray-600 block sm:hidden" />
          <h1 className="text-gray-600 text-2xl font-medium hidden sm:block" >Insta<span className="font-bold">Club</span></h1>
        </Link>

        <SearchBar />

        <div className="flex space-x-4 items-center">
          <button>
            <Link to={`/${userInfo?.username}`} >
              <UserCircleIcon className="h-7 text-gray-600" />
            </Link>
          </button>
          
          <button onClick={() => auth.signOut()}>
            <LogoutIcon className="h-7 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
