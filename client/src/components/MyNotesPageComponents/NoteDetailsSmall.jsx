import { useState } from "react";

import NoteDetailsForm from "./NoteDetailsForm";

function NoteDetailsFormSmall() {
  const [formVisibility, setFormVisibility] = useState(false);

  const showForm = () => {
    setFormVisibility(!formVisibility);
  };

  const style = {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translate(-50%, 0%)",
    zIndex: "15",
  };

  const coverStyle = {
    backdropFilter: "blur(3px)",
    zIndex: "12",
  };

  return (
    <>
      <div>
        <button className="button showDetails" onClick={showForm}>
          Note Details / Post Note
        </button>
      </div>

      {formVisibility && (
        <>
          <div
            className="cover absolute h-full w-full top-0 left-0"
            style={coverStyle}
            onClick={showForm}
          >
            <button className="button absolute top-4 right-4">X</button>
          </div>
        </>
      )}

      <div style={formVisibility ? style : { display: "none" }}>
        <NoteDetailsForm />
      </div>
    </>
  );
}

export default NoteDetailsFormSmall;
