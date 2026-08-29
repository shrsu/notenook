import createNoteSideImg from "../../assets/createNoteSideImg.jpg";
import { motion } from "framer-motion";

import { Card, CardTitle, CardDescription, CardHeader } from "../ui/card";

function CreateNoteSideImg() {
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
      className="max-w-[80vw] w-fit rounded-[5%] p-6 relative mt-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <img
        src={createNoteSideImg}
        alt="sideImg"
        className="createNoteSideImg relative max-w-[50vw] max-h-[50vh] rounded-[5%] aspect-square"
      />
      <Card className="absolute bg-[#0C0A09] w-80 -bottom-4 translate-y-1/2 xl:translate-y-0 xl:-right-2 left-1/2 -translate-x-1/2 xl:translate-x-0">
        <CardHeader>
          <CardTitle className="text-white">Create a New Note!</CardTitle>
          <CardDescription>Fill in the details to get started</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

export default CreateNoteSideImg;
