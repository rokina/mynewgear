import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import { login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const App = () => {
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
        <ScrollToTop />
        <Header />
        <main className="text-white px-[80px] py-[50px] bg-black min-h-[calc(100vh-94px)] lg:px-[50px] md:px-[15px] md:py-[20px]">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/mypage/" element={<MyPage />} />
            <Route path="/terms/" element={<Terms />} />
            <Route path="/privacy/" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
};

export default App;
