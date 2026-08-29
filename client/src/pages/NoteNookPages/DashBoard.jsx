import { useContext } from "react";

import Stats from "../../components/DashBoardComponents/Stats";
import DashboardReviewList from "../../components/DashBoardComponents/DashboardReviewList";
import DashboardNoteList from "../../components/DashBoardComponents/DashboardNoteList";
import Connections from "../../components/Connections";

import { DeviceWidthContext } from "../../context/deviceWidthContext";

function DashBoard() {
  const width = useContext(DeviceWidthContext);

  return (
    <div className="dashBoardPage page scrollHidden grid grid-cols-1 xl:grid-cols-[1fr_325px] gap-4 ">
      <div className="dashBoard page css grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_1fr_1fr_1fr] gap-4">
        <Stats />
        {width > 768 && <DashboardNoteList />}

        <DashboardReviewList />
      </div>
      {width > 1280 && <Connections />}
    </div>
  );
}

export default DashBoard;
