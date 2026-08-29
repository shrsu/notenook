import { useContext } from "react";

import { FaNoteSticky } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";

import { Card, CardTitle } from "../ui/card";

import { UserContext } from "../../context/userContext";

function Stats() {
  const { user } = useContext(UserContext);

  return (
    <div className="rounded-lg bg-[#09090B] p-6">
      <h1 className="text-xl font-bold mb-4 text-neutral-400">Stats</h1>
      <div className="flex gap-4">
        <Card className="statDiv relative w-full p-4 bg-[#0C0A09] text-white border-neutral-600 border-[0.25px]">
          <CardTitle className="text-sm lg:text-lg">
            No. of Connections
          </CardTitle>
          <FaUserFriends className="text-yellow-500 absolute bottom-4 right-4 text-base" />
          <p className="text-base lg:text-lg font-semibold">
            {user?.numberOfConnections || 0}
          </p>
        </Card>

        <Card className="statDiv relative w-full p-4 bg-[#0C0A09] text-white border-neutral-600 border-[0.25px]">
          <CardTitle className="text-sm lg:text-lg">No. of Notes</CardTitle>
          <FaNoteSticky className="text-yellow-500 absolute bottom-4 right-4 text-base" />
          <p className="text-base lg:text-lg font-semibold">
            {user?.numberOfNotes || 0}
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Stats;
