import ReviewList from "../NoteLists/ReviewList";

function DashboardReviewList() {
  return (
    <div className="relative rounded-lg bg-[#09090B] row-span-3 dashBoardComponent p-6">
      <h1 className="h-[5%] text-xl font-bold mb-4 text-neutral-400">
        My review List
      </h1>
      <div className="reviewListContainer h-[94%] overflow-y-scroll pr-2">
        <ReviewList />
      </div>
    </div>
  );
}

export default DashboardReviewList;
