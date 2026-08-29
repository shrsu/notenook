import { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  setSearchUsersPrompt,
  setSearchUsersResults,
} from "../../redux/searchResults/searchResultsSlice";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { IoIosSearch } from "react-icons/io";

import { DeviceWidthContext } from "../../context/deviceWidthContext";

import Connections from "../../components/Connections";
import UserResult from "../../components/SearchUsersPageComponents/UserResult";
import Loader from "../../components/Loaders/Loader";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function SearchUsersPage() {
  const dispatch = useDispatch();
  const searchUsersPrompt = useSelector(
    (state) => state.searchResults.searchUsersPrompt
  );
  const searchUsersResults = useSelector(
    (state) => state.searchResults.searchUsersResults
  );

  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(searchUsersPrompt);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const width = useContext(DeviceWidthContext);

  useEffect(() => {
    setSearchInput(searchUsersPrompt);
  }, [searchUsersPrompt]);

  const handleSearch = async () => {
    if (searchInput === "") {
      return;
    }
    dispatch(setSearchUsersResults(null));
    setSearchingUsers(true);
    try {
      const token = extractTokenFromCookie();
      if (token) {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_SEARCH_USERS_ENDPOINT
          }?searchInput=${searchInput}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        dispatch(setSearchUsersResults(response.data.users));
        setError(null);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setError("An error occurred while searching users. Please try again.");
    } finally {
      setSearchingUsers(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="page css scrollHidden grid grid-cols-1 xl:grid-cols-[1fr_325px] gap-4">
      <div className="page css flex flex-col items-center gap-6">
        <div className="flex w-full max-w-sm items-center space-x-2 min-h-fit h-[5%]">
          <Input
            type="text"
            placeholder="Search for users..."
            className="text-black"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              dispatch(setSearchUsersPrompt(e.target.value));
            }}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" onClick={handleSearch}>
            <IoIosSearch className="text-2xl" />
          </Button>
        </div>

        <div className="p-4 relative w-full max-w-[90vw] h-[95%] overflow-y-scroll grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,400px))] justify-center gap-10 gap-y-0 auto-rows-min">
          {searchingUsers && <Loader action={"Searching For Users..."} />}
          {error && !searchingUsers && (
            <p className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[40%] text-base text-red-500 font-bold text-center">
              {error}
            </p>
          )}
          {searchUsersResults && searchUsersResults.length === 0 && (
            <p className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[40%] text-sm text-neutral-300 text-center">
              No Users found
            </p>
          )}
          {!searchUsersResults && !error && !searchingUsers && (
            <p className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[40%] text-sm text-neutral-300 text-center z-0">
              Search Users to form Connections
            </p>
          )}
          {searchUsersResults &&
            searchUsersResults.map((result) => {
              return <UserResult key={uuidv4()} user={result} />;
            })}
        </div>
      </div>
      {width > 1024 && <Connections />}
    </div>
  );
}

export default SearchUsersPage;
