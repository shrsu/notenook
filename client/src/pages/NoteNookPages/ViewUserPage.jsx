import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import ViewUserInfo from "../../components/UserProfileComponents/ViewuserInfo";
import ViewUserProfileContent from "../../components/UserProfileComponents/ViewUserProfileContent";
import ActionLoader from "../../components/Loaders/ActionLoader";

function ViewUserPage() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = extractTokenFromCookie();
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_GET_USER_DETAIL_ENDPOINT
          }/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserInfo(response.data.user);
      } catch (error) {
        setError("Error fetching user data. Please try again later.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="userProfilePage page lg:w-[900px] max-w-[90vw] m-auto">
      {loading && <ActionLoader action="Fetching User Data..." />}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {!loading && userInfo && (
        <>
          <ViewUserInfo userInfo={userInfo} setUserInfo={setUserInfo} />
          <ViewUserProfileContent userInfo={userInfo} />
        </>
      )}
    </div>
  );
}

export default ViewUserPage;
