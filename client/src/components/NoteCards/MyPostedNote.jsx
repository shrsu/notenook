import { Link } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";

import formatDate from "../../Functions/FormatDate";

function MyPostedNote({ note, confirmDelete }) {
  return (
    <Card className="mb-2 bg-[#0C0A09] text-white border-neutral-600 border-[0.25px]">
      <CardHeader className="p-4">
        <Link to={`/notenook/viewNote/${note.note}`}>
          <CardTitle className="font-bold text-xl">
            <span>Title:</span> {note.title}
          </CardTitle>
          <p className="text-sm">
            <span>Subject:</span> {note.subject}
          </p>
        </Link>
        <p className="text-xs">Posted {formatDate(note.createdAt)}</p>
      </CardHeader>
      <CardContent className="p-4 flex justify-end gap-5">
        <Link to={`/notenook/viewNote/${note.note}`}>
          <Button variants="primary" className="text-xs h-fit">
            View
          </Button>
        </Link>
        <Button
          onClick={() => confirmDelete(note.note)}
          variant="destructive"
          className="text-xs h-fit w-fit"
        >
          Unpost
        </Button>
      </CardContent>
    </Card>
  );
}

export default MyPostedNote;
