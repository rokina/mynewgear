import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black-dark py-[10px] flex justify-center relative text-[12px] md:block md:text-center">
      <div className="text-white absolute right-[20px] md:relative md:right-[0px]">
        <Link to="/terms/">利用規約</Link>
        <Link to="/privacy/" className="ml-[15px]">
          プライバシーポリシー
        </Link>
      </div>
      <small className="text-white text-[12px] md:inline-block md:mt-[5px]">
        &copy; MyNewGear
      </small>
    </footer>
  );
};

export default Footer;
