import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Card } from "antd";
import moment from "moment";

const Username = () => {
  const [state, setState] = useContext(UserContext);

  // state
  const [user, setUser] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) fetchUser();
  }, [router.query.username]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/user/${router.query.username}`);
      console.log("user", data);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  const imageSource = (user) => {
    if (user.image) return user.image.url;
    return "/images/logo.png";
  };

  return (
    <div className="row col-md-6 offset-md-3">
      {/*<pre>{JSON.stringify(user, null, 4)}</pre>*/}
      <div className="pt-5 pb-5">
        <Card hoverable cover={<img src={imageSource(user)} alt={user.name} />}>
          <Card.Meta title={user.name} description={user.about} />
          <p className="pt-2 text-muted">
            Joined {moment(user.createdAt).fromNow()}
          </p>
          <div className="d-flex justify-content-between">
            <span className="btn btn-sm">
              {user.followers && user.followers.length} Followers
            </span>
            <span className="btn btn-sm">
              {user.following && user.following.length} Following
            </span>
          </div>
        </Card>
        <Link
          href="/user/dashboard"
          className="d-flex justify-content-center pt-5"
        >
          <RollbackOutlined />
        </Link>
      </div>
    </div>
  );
};

export default Username;
