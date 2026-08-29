import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatDate from "../../Functions/FormatDate";

function NoteResult({ result }) {
  return (
    <Card className="mb-2 bg-[#0C0A09] text-white border-neutral-600 border-[0.25px]">
      <CardHeader className="p-4 pb-0">
        <Link
          to={`/notenook/viewUser/${result.postedBy._id}`}
          className="flex items-center space-x-2"
        >
          <Avatar>
            <AvatarImage src={result.postedBy.avatar} />
            <AvatarFallback>
              {result.postedBy.username.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span>{result.postedBy.username}</span>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <CardTitle className="font-bold text-xl">
          <span className="text-yellow-500">Title:</span> {result.title}
        </CardTitle>
        <p className="text-sm">
          <span className="text-yellow-500">Subject:</span> {result.subject}
        </p>
        <p className="text-xs text-neutral-400">
          Posted {formatDate(result.updatedAt)}
        </p>
        <div className="flex justify-end gap-5">
          <Link to={`/notenook/viewNote/${result.note}`}>
            <Button variant="secondary" className="text-xs">
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default NoteResult;
