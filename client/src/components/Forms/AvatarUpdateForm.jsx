import { useState, useRef, useContext } from "react";
import axios from "axios";

import { storage } from "../../firebase";
import {
  deleteObject,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { UserContext } from "../../context/userContext";

import AvatarEditor from "react-avatar-editor";
import ErrorAlert from "../MyNotesPageComponents/ErrorAlert";
import ActionLoader from "../Loaders/ActionLoader";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function AvatarUpdateForm() {
  const { user, setUser } = useContext(UserContext);

  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  const handleNewImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setError("");
      setShowError(false);
    } else {
      setError("Please select an image file.");
      setShowError(true);
    }
  };

  const handleScale = (e) => {
    setScale(parseFloat(e.target.value));
  };

  const handleSave = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const avatarBlob = await new Promise((resolve) => canvas.toBlob(resolve));
      if (avatarBlob) {
        setLoading(true);
        const token = extractTokenFromCookie();
        try {
          const avatarUrl = await uploadFileToStorage(avatarBlob);
          await updateAvatarInDatabase(avatarUrl, token);
          setPreview(avatarUrl);
          setError("");
          setShowError(false);
        } catch (err) {
          setError(`Failed to upload avatar: ${err.message}`);
          setShowError(true);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const deleteFileFromStorage = async (fileUrl) => {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  };

  const uploadFileToStorage = async (file) => {
    const avatarRef = ref(storage, `avatars/${user.username}`);
    const response = await uploadBytes(avatarRef, file);
    return await getDownloadURL(response.ref);
  };

  const updateAvatarInDatabase = async (url, token) => {
    await axios.patch(
      import.meta.env.VITE_REACT_APP_UPDATE_AVATAR_URL,
      { avatar: url },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUser({ ...user, avatar: url });
  };

  return (
    <div className="relative flex flex-col items-center bg-[#09090B] py-8 px-4 rounded-md max-w-[90vw] text-white mb-14">
      {showError && <ErrorAlert message={error} />}
      {loading && <ActionLoader action={"Updating avatar..."} />}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-60 aspect-square mb-4 rounded-full"
        />
      )}

      <input
        type="file"
        onChange={handleNewImage}
        className={`mb-4 text-white file:bg-[#f5c518] file:text-black file:border-none file:rounded-md file:px-4 file:py-2 hover:file:bg-[#e4b900] cursor-pointer ${
          image ? "ml-0" : "ml-[25%]"
        }`}
      />
      {image && (
        <>
          <AvatarEditor
            ref={editorRef}
            image={image}
            width={250}
            height={250}
            border={50}
            borderRadius={125}
            color={[0, 0, 0, 0.6]}
            scale={scale}
            rotate={0}
          />
          <input
            type="range"
            value={scale}
            min="1"
            max="2"
            step="0.015"
            onChange={handleScale}
            className="my-4 w-full accent-[#f5c518] bg-[#333] rounded-md cursor-pointer"
          />
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-[#f5c518] text-black rounded-md hover:bg-[#e4b900]"
          >
            Save
          </button>
        </>
      )}
    </div>
  );
}

export default AvatarUpdateForm;
