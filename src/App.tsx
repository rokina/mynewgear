import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Feed from "./components/Feed";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MyPage from "./components/MyPage";
import { login, logout } from "./features/userSlice";
import { auth } from "./firebase";

const App: React.FC = () => {
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
        <main className="text-white px-[80px] py-12 bg-black min-h-[calc(100vh-104px)] lg:px-[50px] md:px-[20px]">
          <Route exact path="/" component={Feed} />
          <Route path="/mypage/" component={MyPage} />
        </main>
        <Footer />
      </Router>
    </>
  );
};

export default App;
