import UserPostedNote from "../NoteCards/ViewUserPostedNote";
function UserPostedNoteList({ postedNotes }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 justify-center pr-2">
      {postedNotes && postedNotes.map((note) => <UserPostedNote note={note} />)}
    </div>
  );
}

export default UserPostedNoteList;
