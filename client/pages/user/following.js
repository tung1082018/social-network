import { useContext, useEffect, useState } from "react";
import { Avatar, List } from "antd";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import { toast } from "react-toastify";

const Following = () => {
  const [state, setState] = useContext(UserContext);

  // state
  const [people, setPeople] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (state && state.token) fetchFollowing();
  }, [state && state.token]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get("/user-following");
      console.log("following list", data);
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const imageSource = (user) => {
    if (user.image) return user.image.url;
    return "/images/logo.png";
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
      const unfollowing = people.filter((p) => p._id !== user._id);
      setPeople(unfollowing);

      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row col-md-6 offset-md-3">
      {/*<pre>{JSON.stringify(people, null, 4)}</pre>*/}
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imageSource(user)} />}
              title={
                <div className="d-flex justify-content-between mt-2">
                  {user.username}{" "}
                  <span
                    onClick={() => handleUnfollow(user)}
                    className="text-primary pointer"
                  >
                    Unfollow
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Link
        href="/user/dashboard"
        className="d-flex justify-content-center pt-5"
      >
        <RollbackOutlined />
      </Link>
    </div>
  );
};

export default Following;
