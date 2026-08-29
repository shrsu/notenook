import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import ToolBar from "./ToolBar";
import ActionLoader from "../Loaders/ActionLoader";
import ErrorAlert from "./ErrorAlert";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function TextEditor() {
  const { documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [savingError, setSavingError] = useState(null);

  useEffect(() => {
    const token = extractTokenFromCookie();
    if (!token) {
      setLoadingError("Authorization failed. Please login again.");
      setIsLoading(false);
      return;
    }

    const socketConnection = io(
      import.meta.env.VITE_REACT_APP_TEXT_EDITOR_SOCKET,
      { auth: { token } }
    );

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    setIsLoading(true);

    socket.emit("get-document", documentId);

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
      setIsLoading(false);
    });

    socket.on("authorization-error", (error) => {
      setLoadingError(error);
      setIsLoading(false);
    });

    socket.on("document-fetch-error", (errorMessage) => {
      setLoadingError(errorMessage);
      setIsLoading(false);
    });

    socket.on("document-save-error", (errorMessage) => {
      setSavingError(errorMessage);
    });

    const interval = setInterval(() => {
      setIsSaving(true);
      socket.emit("save-document", quill.getContents());
      setIsSaving(false);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");

    wrapper.append(editor);
    const q = new Quill(editor, {
      modules: {
        toolbar: { container: "#toolbar" },
      },
      theme: "snow",
    });
    q.disable();
    q.setText("Loading document......");
    setQuill(q);
  }, []);

  return (
    <div className="relative textEditor page">
      {loadingError && (
        <ErrorAlert
          error={loadingError}
          showError={true}
          setError={setLoadingError}
          setShowError={() => {}}
        />
      )}
      {savingError && (
        <ErrorAlert
          error={savingError}
          showError={true}
          setError={setSavingError}
          setShowError={() => {}}
        />
      )}
      {isLoading && <ActionLoader action={"Loading document..."} />}
      {isSaving && <ActionLoader action={"Saving document..."} />}
      <ToolBar />
      <div
        id="textEditorContainer"
        className="h-[calc(100%-70px)] md:h-[calc(100%-30px)] w-full p-4"
        ref={wrapperRef}
      >
        <div id="editor"></div>
      </div>
    </div>
  );
}

export default TextEditor;
