import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


function UserResult({ user }) {
  return (
    <Card className="mb-4 bg-[#0C0A09] text-white border-neutral-600 border-[0.25px] rounded-lg overflow-hidden shadow-lg">
      <CardHeader className="p-4 pb-0">
        <Link
          to={`/notenook/viewUser/${user._id}`}
          className="flex items-center space-x-4"
        >
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar} alt={`${user.username}'s avatar`} />
            <AvatarFallback>{user.username.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm text-neutral-400">{user.fullname}</p>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-end">
          <Link to={`/notenook/viewUser/${user._id}`}>
            <Button className="text-xs h-fit">View Profile</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserResult;
