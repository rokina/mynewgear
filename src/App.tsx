import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth";
import Feed from "./components/Feed";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MyPage from "./components/MyPage";
import { login, logout, selectUser } from "./features/userSlice";
import { auth } from "./firebase";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);
  return (
    <>
      <Router>
        <Header />
        {user.uid ? (
          <main className="bg-gray-800 text-white px-24 py-12">
            <Route exact path="/" component={Feed} />
            <Route path="/mypage/" component={MyPage} />
          </main>
        ) : (
          <Auth />
        )}
        <Footer />
      </Router>
    </>
  );
};

export default App;
