import { useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { storage } from "../../firebase";
import {
  deleteObject,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

import ErrorAlert from "./ErrorAlert";
import ActionLoader from "../Loaders/ActionLoader";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function PDFUploader({
  documentId,
  fileName,
  setFileName,
  fileUrl,
  setFileUrl,
}) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const fileInputRef = useRef(null);

  const isValidFile = (file) => {
    if (file && file.type === "application/pdf") {
      if (file.size > MAX_FILE_SIZE) {
        setError(
          "File size exceeds the maximum limit (10MB). Please upload a smaller file."
        );
        setShowError(true);
        return false;
      }
      return true;
    } else {
      setError("Please select a PDF file.");
      setShowError(true);
      return false;
    }
  };

  const handleRemoveFile = async () => {
    if (fileUrl) {
      const token = extractTokenFromCookie();
      if (!token) return;

      setIsDeleting(true);
      try {
        await deleteFileFromStorage(fileUrl, token);
        setFileUrl("");
      } catch (error) {
        setError("Failed to remove file");
        setShowError(true);
        console.log(error);
      } finally {
        setIsDeleting(false);
      }
    }

    resetFileInput();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (isValidFile(selectedFile)) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const token = extractTokenFromCookie();
    if (!token) return;

    setIsUploading(true);
    try {
      const url = await uploadFileToStorage(file);
      setFileUrl(url);
      await updateFileInDatabase(url, token);
    } catch (error) {
      setError("Upload failed");
      setShowError(true);
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFileFromStorage = async (fileUrl, token) => {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    await axios.delete(
      `${import.meta.env.VITE_REACT_APP_DELETE_PDF_ENDPOINT}/${documentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const uploadFileToStorage = async (file) => {
    const pdfRef = ref(storage, `pdfs/${file.name + uuidv4()}`);
    const response = await uploadBytes(pdfRef, file);
    return await getDownloadURL(response.ref);
  };

  const updateFileInDatabase = async (url, token) => {
    await axios.patch(
      import.meta.env.VITE_REACT_APP_UPDATE_PDF_ENDPOINT,
      { noteId: documentId, fileName: file.name, url: url },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div className="self-center mt-4">
      <div
        className="w-full text-black bg-white text-center text-sm p-4 rounded-md"
        title={fileName || "No file chosen"}
      >
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="file-name text-blue-600 block text-sm"
          >
            {fileName}
          </a>
        ) : (
          <p className="text-black w-full whitespace-nowrap overflow-hidden text-ellipsis">
            {fileName || "No file"}
          </p>
        )}
        {fileName && (
          <button className="ml-2 text-red-500 mt-4" onClick={handleRemoveFile}>
            {fileUrl ? "Delete File" : "Remove file"}
          </button>
        )}
      </div>

      <div className="flex w-full justify-end my-4 gap-6">
        <div className="w-[7.5rem]">
          <Input
            ref={fileInputRef}
            type="file"
            aria-describedby="fileInputLabel"
            accept=".pdf"
            multiple={false}
            onChange={handleFileChange}
          />
        </div>
        <Button className="button" variant="secondary" onClick={uploadFile}>
          Update
        </Button>
      </div>

      {isUploading && <ActionLoader action={"Uploading pdf..."} />}
      {isDeleting && <ActionLoader action={"Deleting pdf..."} />}

      <ErrorAlert
        error={error}
        showError={showError}
        setError={setError}
        setShowError={setShowError}
      />
    </div>
  );
}

export default PDFUploader;
