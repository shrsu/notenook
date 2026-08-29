import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

function WelcomeText() {
  const { isUserLoggedIn } = useContext(UserContext);

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="flex flex-col px-8 text-center xl:text-left"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Welcome to Note Nook!!!
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold my-4">
        If You Aren't Taking Notes, You Aren't Learning.
      </h2>
      <h3 className="text-lg md:text-xl my-4">
        Take notes. Connect. Share. Grow.
      </h3>
      {isUserLoggedIn ? (
        <Link to="/notenook/dashboard">
          <Button>Dashboard</Button>
        </Link>
      ) : (
        <Link to="/forms/registration">
          <Button>Get Started</Button>
        </Link>
      )}
    </motion.div>
  );
}

export default WelcomeText;
