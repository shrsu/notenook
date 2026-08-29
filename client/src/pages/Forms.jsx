import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Button } from "../components/ui/button";
import RegistrationForm from "../components/Forms/RegistrationForm";
import LoginForm from "../components/Forms/LoginForm";
import OTPVerificationForm from "../components/Forms/OTPVerificationForm";
import LoginSideImg from "../components/SideImages/LoginSideImg";
import RegisterSideImg from "../components/SideImages/RegisterSideImg";
import OTPSideImg from "../components/SideImages/OTPSideImage";
import logo from "../assets/logo.png";

function Forms() {
  const [userData, setUserData] = useState({ email: "" });

  return (
    <div className="overflow-x-hidden">
      <div className="flex w-screen justify-between items-center p-8 min-h-[10vh]">
        <Link to="/">
          <img src={logo} alt="" className="logo h-16 md:h-20 " />
        </Link>

        <div className="flex justify-between items-center">
          <Link to={"/"}>
            <Button>Home</Button>
          </Link>
        </div>
      </div>
      <div className="min-h-[70vh] xl:mt-0 flex flex-col md:flex-row px-8 gap-10 justify-center md:justify-around">
        <div className="order-2 xl:order-1 hidden xl:block">
          <Routes>
            <Route path="/registration" element={<RegisterSideImg />} />
            <Route path="/login" element={<LoginSideImg />} />
            <Route
              path="/verification"
              element={<OTPSideImg userData={userData} />}
            />
          </Routes>
        </div>

        <div className="xl:mt-0 order-1 xl:order-2 w-[500px] max-w-[90vw] self-center">
          <Routes>
            <Route
              path="/registration"
              element={<RegistrationForm setUserData={setUserData} />}
            />
            <Route
              path="/login"
              element={<LoginForm setUserData={setUserData} />}
            />
            <Route
              path="/verification"
              element={<OTPVerificationForm userData={userData} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Forms;
