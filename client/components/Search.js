import { useState, useContext } from "react";
import { UserContext } from "../context";
import axios from "axios";
import People from "./cards/People";
import { toast } from "react-toastify";

const Search = () => {
  const [state, setState] = useContext(UserContext);

  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  const searchUser = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const { data } = await axios.get(`/search-user/${query}`);
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });

      // update local storage (update user, keep token)
      const auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));

      // update context
      setState({ ...state, user: data });

      // update people state
      const unfollowing = result.filter((p) => p._id !== user._id);
      setResult(unfollowing);
      toast.success(`Following ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("user-unfollow", { _id: user._id });

      // update local storage (update user, keep token)
      const auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));

      // update context
      setState({ ...state, user: data });

      // update people state
      const unfollowing = result.filter((p) => p._id !== user._id);
      setResult(unfollowing);

      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form className="form-inline row" onSubmit={searchUser}>
        <div className="col-8">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => {
              setQuery(e.target.value);
              setResult([]);
            }}
            value={query}
            className="form-control"
          />
        </div>
        <div className="col-4">
          <button type="submit" className="btn btn-outline-primary col-12">
            Search
          </button>
        </div>
      </form>

      {result && (
        <People
          people={result}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />
      )}
    </>
  );
};

export default Search;
