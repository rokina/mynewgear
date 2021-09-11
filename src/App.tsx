import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import "./App.css";
import Auth from "./components/Auth";
import Feed from "./components/Feed";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
      <Header />
      {user.uid ? (
        <main className="bg-gray-800 text-white px-24 py-12">
          <Feed />
        </main>
      ) : (
        <Auth />
      )}
      <Footer />
    </>
  );
};

export default App;
