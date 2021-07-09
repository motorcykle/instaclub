import { BellIcon, LogoutIcon, UploadIcon, UserCircleIcon } from '@heroicons/react/outline';
import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import NotificationPop from './NotificationPop';

const Header = () => {
  return (
    <div className="shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-3">
        <Link to="/">
          <h1 className="text-gray-600 text-2xl font-medium" >Insta<span className="font-bold">Club</span></h1>
        </Link>

        <div className="flex space-x-4 items-center">
          <NotificationPop />
          
          <button>
            <Link to="/profile" >
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
