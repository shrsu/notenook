import axios from "axios";

import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

/**
 * Ask a question against the user's own indexed notes.
 *
 * Unlike the general chat socket, this is a single stateless request: the
 * server retrieves matching note chunks, answers only from those, and returns
 * the sources it cited so the UI can show where the answer came from.
 */
const askNotes = async (question) => {
  const { data } = await axios.post(
    import.meta.env.VITE_REACT_APP_AI_ASK_ENDPOINT,
    { question },
    { headers: { Authorization: `Bearer ${extractTokenFromCookie()}` } }
  );
  return data;
};

export default askNotes;
