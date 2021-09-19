import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase";
import Icon from "../img/icon_user.svg";
import Logo from "../img/logo.svg";

const Header: React.FC = () => {
  const user = useSelector(selectUser);
  return (
    <header className="bg-black p-3">
      <h1 className="flex items-center justify-between">
        <Link to="/">
          <img src={Logo} alt="MNG" />
        </Link>
        <nav>
          <ul className="text-white flex items-center space-x-4 text-base">
            <li>
              <Link to="/?cat=guitar">#guitar</Link>
            </li>
            <li>
              <Link to="/?cat=bass">#bass</Link>
            </li>
            <li>
              <Link to="/?cat=other">#other</Link>
            </li>
            <li className="w-9 rounded-full overflow-hidden">
              <Link to="/mypage/">
                <img
                  src={user.photoUrl ? user.photoUrl : Icon}
                  alt=""
                  // onClick={async () => {
                  //   await auth.signOut();
                  // }}
                />
              </Link>
            </li>
            <li className="w-9 rounded-full overflow-hidden">
              <Link to="">
                <img
                  src={user.photoUrl ? user.photoUrl : Icon}
                  alt=""
                  onClick={async () => {
                    await auth.signOut();
                  }}
                />
              </Link>
            </li>
          </ul>
        </nav>
      </h1>
    </header>
  );
};

export default Header;
