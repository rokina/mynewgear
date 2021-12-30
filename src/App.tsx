import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Feed from "./components/Feed";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import { login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import MyPage from "./pages/MyPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

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
        <ScrollToTop>
          <Header />
          <main className="text-white px-[80px] py-[50px] bg-black min-h-[calc(100vh-94px)] lg:px-[50px] md:px-[15px] md:py-[20px]">
            <Route exact path="/" component={Feed} />
            <Route path="/mypage/" component={MyPage} />
            <Route path="/terms/" component={Terms} />
            <Route path="/privacy/" component={Privacy} />
          </main>
          <Footer />
        </ScrollToTop>
      </Router>
    </>
  );
};

export default App;
