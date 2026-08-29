import { useState } from "react";
import { Link } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";

import formatDate from "../../Functions/FormatDate";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import CircularProgress from "@mui/material/CircularProgress";

function MySavedReviewNote({
  savedNote,
  originalNoteId,
  handleUnmarkForReview,
}) {
  const [loading, setLoading] = useState(false);

  const handleUnmark = async () => {
    setLoading(true);
    await handleUnmarkForReview(savedNote._id);
    setLoading(false);
  };

  return (
    <Card className="mb-2 bg-[#0C0A09] text-white border-neutral-600 border-[0.25px]">
      <CardHeader className="p-4">
        <CardTitle className="font-bold text-xl">
          <span>Title:</span> {savedNote.title}
        </CardTitle>
        <p className="text-sm">
          <span>Subject:</span> {savedNote.subject}
        </p>
        <p className="text-xs">Posted {formatDate(savedNote.updatedAt)}</p>
      </CardHeader>
      <CardContent className="p-4 flex justify-end gap-5 items-center">
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <BookmarkIcon className="text-yellow-500" onClick={handleUnmark} />
        )}

        <Link to={`/notenook/viewNote/${savedNote._id}`}>
          <Button variants="primary" className="text-xs h-fit">
            View
          </Button>
        </Link>

        <Link to={`/notenook/viewNote/${originalNoteId}`}>
          <Button variant="secondary" className="text-xs h-fit">
            Original note
          </Button>{" "}
        </Link>
      </CardContent>
    </Card>
  );
}

export default MySavedReviewNote;
