import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { selectUser } from "../features/userSlice";
import Icon from "../img/icon_user.svg";
import Logo from "../img/logo.svg";
import Auth from "./Auth";

const Header = () => {
  const user = useSelector(selectUser);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpenModal(true);
  };

  return (
    <header className="bg-black-dark py-[10px] px-[20px] md:px-[15px]">
      <h1 className="flex items-center justify-between">
        <Link to="/">
          <img src={Logo} alt="MNG" />
        </Link>
        <nav>
          <ul className="text-white flex items-center space-x-[10px]">
            <li className="flex items-center">
              <TwitterShareButton
                url={"https://my-newgear.web.app/\n\n"}
                title={"「my new gear...」で自慢の機材を共有しよう"}
                hashtags={["mynewgear"]}
              >
                <TwitterIcon size={36} round />
              </TwitterShareButton>
            </li>
            <li className="w-[36px] h-[36px] rounded-full overflow-hidden">
              {user.uid ? (
                <Link to="/mypage/">
                  <img
                    src={user.photoUrl ? user.photoUrl : Icon}
                    className="h-full"
                    alt=""
                  />
                </Link>
              ) : (
                <>
                  <img src={Icon} alt="" onClick={handleOpen} />
                  <Auth openModal={openModal} setOpenModal={setOpenModal} />
                </>
              )}
            </li>
          </ul>
        </nav>
      </h1>
    </header>
  );
};

export default Header;
