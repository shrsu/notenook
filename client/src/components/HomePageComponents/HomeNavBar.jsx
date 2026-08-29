import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../context/userContext";
import { Button } from "../ui/button";

import logo from "../../assets/logo.png";

function HomeNavBar() {
  const { isUserLoggedIn } = useContext(UserContext);
  return (
    <div className="flex w-screen justify-between items-center p-8 min-h-[10vh]">
      <Link to="/">
        <img src={logo} alt="" className="logo h-16 md:h-20 " />
      </Link>

      <div className="flex w-52 max-w-[50vw] justify-between items-center">
        {isUserLoggedIn ? (
          <>
            <Link to="/notenook/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="notenook/profile">
              <Button variant="ghost"> Profile</Button>
            </Link>
          </>
        ) : (
          <>
            <Link to={"/forms/registration"}>
              <Button variant="ghost">Register</Button>
            </Link>

            <Link to={"/forms/login"}>
              <Button variant="ghost">Login</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default HomeNavBar;
