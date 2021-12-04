import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black-dark p-3 flex justify-center relative">
      <small className="text-white">&copy; MyNewGear Inc.</small>
      <div className="text-white absolute right-[20px] text-[12px]">
        <Link to="/terms/">利用規約</Link>
        <Link to="/privacy/" className="ml-[15px]">
          プライバシーポリシー
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
