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
        {/* {user.uid ? ( */}
        <main className="text-white px-[80px] py-12 bg-black lg:px-[50px] md:px-[20px]">
          <Route exact path="/" component={Feed} />
          <Route path="/mypage/" component={MyPage} />
          <Route path="/login/" component={Auth} />
        </main>
        {/* ) : (
          <Auth />
        )} */}
        <Footer />
      </Router>
    </>
  );
};

export default App;
