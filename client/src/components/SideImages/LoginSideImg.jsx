import loginSideImg from "../../assets/loginSideImg.png";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "../ui/card";
import { Link } from "react-router-dom";

function LoginSideImg() {
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
      className="sideImgContainer max-w-[80vw] w-fit rounded-[5%] p-6 relative mt-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <img
        src={loginSideImg}
        alt="sideImg"
        className="sideImg relative w-[500px] max-w-[60vw] rounded-[5%]"
      />
      <Card className="absolute bg-[#0C0A09] w-96 -bottom-12 translate-y-1/2 xl:translate-y-0 xl:-right-8 left-1/2 -translate-x-1/2 xl:translate-x-0">
        <CardHeader>
          <CardTitle className="text-white">Login and Get started!</CardTitle>
          <CardDescription>
            Don't have an account? Lets register!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/forms/registration">
            <Button>Register</Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default LoginSideImg;
