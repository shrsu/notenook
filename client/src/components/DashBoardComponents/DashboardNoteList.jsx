import { useSelector } from "react-redux";
import Note from "../NoteCards/Note";

function DashboardNoteList() {
  const notes = useSelector((state) => state.notes.notes);

  return (
    <div className="noteList h-full overflow-y-hidden p-4 rounded-lg bg-[#09090B] relative row-span-4">
      {!notes.length && (
        <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-sm text-neutral-300 text-center">
          Your Notes Appear here
        </p>
      )}
      <h1 className="text-xl font-bold mb-4 text-neutral-400">My Notes</h1>

      <div className="h-[94%] max-w-[90vw] overflow-y-scroll px-2 grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]  auto-rows-min gap-2 min-h-[300px]">
        {notes.length !== 0 &&
          notes.map((note) => <Note note={note} key={note._id} />)}
      </div>
    </div>
  );
}

export default DashboardNoteList;
