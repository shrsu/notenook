import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import formatDate from "../../Functions/FormatDate";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CircularProgress from "@mui/material/CircularProgress";
import { FaExternalLinkSquareAlt } from "react-icons/fa";

function SavedNote({
  savedNote,
  originalNoteId,
  confirmDelete,
  handleMarkForReview,
  handleUnmarkForReview,
}) {
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    setLoading(true);
    await handleMarkForReview(savedNote._id);
    setLoading(false);
  };

  const handleUnmark = async () => {
    setLoading(true);
    await handleUnmarkForReview(savedNote._id);
    setLoading(false);
  };

  return (
    <Card className="mb-2 bg-[#0C0A09] text-white border-neutral-600 border-[0.25px] relative">
      <Link to={`/notenook/viewNote/${originalNoteId}`}>
        <FaExternalLinkSquareAlt className="text-xl absolute right-4 top-4 text-yellow-400" />
      </Link>
      <CardHeader className="p-4 w-[calc(100%-2.5rem)]">
        <Link to={`/notenook/viewNote/${savedNote._id}`}>
          <CardTitle className="font-bold text-xl">
            <span>Title:</span> {savedNote.title}
          </CardTitle>
          <p className="text-sm">
            <span>Subject:</span> {savedNote.subject}
          </p>
        </Link>
        <p className="text-xs">Saved {formatDate(savedNote.createdAt)}</p>
      </CardHeader>

      <CardContent className="p-4 flex gap-1 justify-end sm:gap-5 items-center">
        {loading ? (
          <CircularProgress size={24} />
        ) : savedNote.markedForReview ? (
          <BookmarkIcon className="text-yellow-500" onClick={handleUnmark} />
        ) : (
          <BookmarkAddIcon className="text-neutral-500" onClick={handleMark} />
        )}

        <Link to={`/notenook/viewNote/${savedNote._id}`}>
          <Button variants="primary" className="text-xs h-fit">
            View
          </Button>
        </Link>
        <Button
          onClick={() => confirmDelete(savedNote._id)}
          variant="destructive"
          className="text-xs h-fit"
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

export default SavedNote;
