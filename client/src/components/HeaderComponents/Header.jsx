import { Link } from "react-router-dom";

import HeaderNotifications from "./HeaderNotifications";
import HeaderProfile from "./HeaderProfile";

import logo from "../../assets/logo.png";

function Header() {
  return (
    <div className="fixed top-0 left-0 z-40 w-screen flex justify-between items-center py-4 pl-4 h-20 md:h-24 header">
      <div className="block md:mt-4 ml-2">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo md:h-16 h-14" />
        </Link>
      </div>

      <div className="flex gap-4 relative items-center">
        <HeaderNotifications />
        <HeaderProfile />
      </div>
    </div>
  );
}

export default Header;
