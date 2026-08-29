import Friend from "./Friend";

function FriendsList({ friends }) {
  return (
    <div className="p-4 relative w-full max-w-[90vw] h-[95%] overflow-y-scroll grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,400px))] justify-center gap-10 gap-y-0 auto-rows-min">
      {!friends && <p className="placeHolder">Your Friendlist appears here</p>}

      {friends && friends.map((user) => <Friend key={user._id} user={user} />)}
    </div>
  );
}

export default FriendsList;
