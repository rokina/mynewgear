import React from "react";
import { auth } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import Logo from "../img/logo.svg";
import Icon from "../img/icon_user.svg";

const Header: React.FC = () => {
  const user = useSelector(selectUser);
  return (
    <header className="bg-black p-3">
      <h1 className="flex items-center justify-between">
        <a href="/">
          <img src={Logo} alt="MNG" />
        </a>
        <nav>
          <ul className="text-white flex items-center space-x-4 text-base">
            <li>
              <a href="/?cat=guitar">#guitar</a>
            </li>
            <li>
              <a href="#/?cat=bass">#bass</a>
            </li>
            <li>
              <a href="/?cat=other">#other</a>
            </li>
            <li className="w-9 rounded-full overflow-hidden">
              <a href="/mypage/">
                <img
                  src={user.photoUrl ? user.photoUrl : Icon}
                  alt=""
                  onClick={async () => {
                    await auth.signOut();
                  }}
                />
              </a>
            </li>
          </ul>
        </nav>
      </h1>
    </header>
  );
};

export default Header;
