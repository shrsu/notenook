import { useEffect, useState, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function ViewWindow({ note }) {
  const [quill, setQuill] = useState(null);

  useEffect(() => {
    if (!quill) {
      return;
    }
    quill.setContents(note.document);
  }, [note, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");

    wrapper.append(editor);
    const q = new Quill(editor, {
      modules: {
        toolbar: false,
      },
      theme: "snow",
    });
    q.disable();
    q.setText("Loading document......");
    setQuill(q);
  }, []);

  return (
    <article className="viewWindow pb-16">
      <section className="editorSection">
        <div className="editorContainer" ref={wrapperRef}>
          <div id="editor"></div>
        </div>
      </section>
    </article>
  );
}

export default ViewWindow;
