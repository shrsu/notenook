import { Routes, Route } from "react-router-dom";

import WriteNote from "../../components/MyNotesPageComponents/WriteNote";
import NotesList from "../../components/MyNotesPageComponents/NotesList";
import CreateNote from "../../components/MyNotesPageComponents/CreateNote";

function MyNotesPage() {
  return (
    <div className="scrollHidden relative">
      <div className="page">
        <Routes>
          <Route path="/" element={<NotesList />} />
          <Route path="/createNote" element={<CreateNote />} />
          <Route path="/writeNote/:documentId" element={<WriteNote />} />
        </Routes>
      </div>
    </div>
  );
}

export default MyNotesPage;
