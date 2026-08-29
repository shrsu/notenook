import { useContext } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "../ui/card";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";
import sideImg from "../../assets/sideImg.svg";

function SideImage() {
  const { isUserLoggedIn } = useContext(UserContext);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="sideImgContainer max-w-[90vw] rounded-[50%] p-6 relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <img
        src={sideImg}
        alt="sideImg"
        className="sideImg relative w-[500px] max-w-[70vw] rounded-[50%]"
      />
      <Card className="absolute bg-[#0C0A09] w-72 bottom-0 translate-y-1/2 xl:translate-y-0 xl:-left-8 left-1/2 -translate-x-1/2 xl:translate-x-0">
        <CardHeader>
          <CardTitle className="text-white">Get Learning</CardTitle>
          <CardDescription>Make notes, share, grow</CardDescription>
        </CardHeader>
        <CardContent>
          {isUserLoggedIn ? (
            <Link to="/notenook/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <Link to="/forms/registration">
              <Button>Get Started</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SideImage;
