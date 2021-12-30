import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black-dark py-[10px] flex justify-center relative text-[12px]">
      <small className="text-white text-[12px]">&copy; MyNewGear Inc.</small>
      <div className="text-white absolute right-[20px]">
        <Link to="/terms/">利用規約</Link>
        <Link to="/privacy/" className="ml-[15px]">
          プライバシーポリシー
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
