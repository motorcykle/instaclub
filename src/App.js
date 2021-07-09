import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import db, { auth } from './firebase';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Loader from "react-loader-spinner";

import Auth from './views/Auth';
import Home from './views/Home';
import Profile from './views/Profile';

import Header from './components/Header';
import { useEffect } from 'react';
import { removeUserInfo, setUserInfo } from './features/appSlice';
import { useDispatch } from 'react-redux';
import NotFound from './views/NotFound';

function App() {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);

  auth.onAuthStateChanged((user) => {
    if (!user) {
      dispatch(removeUserInfo());
    }
  });

  useEffect(() => {
    const unsub = db.collection('users').doc(user?.uid).onSnapshot(docSnapshot => {
      dispatch(setUserInfo(docSnapshot.data()));
    }, err => {
      console.log(`Encountered error: ${err}`);
    });

    return unsub;
  }, [user])

  return (
    <div className="app flex flex-col">

      <Router>
          {user && <Header />}
          
          <Switch>
            <PrivateRoute exact path="/">
              <Home />
            </PrivateRoute>

            <PrivateRoute exact path="/:username">
              <Profile />
            </PrivateRoute>

            <Route exact path="/*">
              <NotFound />
            </Route>
          </Switch>
          
      </Router>

    </div>
  );
}

export default App;


function PrivateRoute({ children, ...rest }) {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        (loading) ? (
          <div className="loader__container">
            <Loader
              type="TailSpin"
              color="lightgrey"
              height={100}
              width={100}
            />
          </div>
        ) :
        (user) ? (
          children
        ) : (
          <Auth location={location} />
        )
      }
    />
  );
}