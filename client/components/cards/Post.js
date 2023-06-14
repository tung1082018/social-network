import React, { useContext } from "react";
import { Avatar } from "antd";
import { imageSource } from "../../functions";
import moment from "moment";
import renderHTML from "react-render-html";
import PostImage from "../images/PostImage";
import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { UserContext } from "../../context";
import { useRouter } from "next/router";

const Post = ({
  post,
  handleDelete,
  handleLike,
  handleUnlike,
  handleComment,
  commentsCount = 10,
  removeComment,
}) => {
  const [state] = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      {post && post.postedBy && (
        <div className="card mb-5">
          <div className="card-header">
            {/*<Avatar size={40}>{post.postedBy.name[0]}</Avatar>*/}
            <Avatar size={40} src={imageSource(post.postedBy)} />
            <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
              {post.postedBy.name}
            </span>
            <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <div className="card-body">{renderHTML(post.content)}</div>
          <div className="card-footer">
            {post.image && <PostImage url={post.image.url} />}
            <div className="d-flex pt-2">
              {state &&
              state.user &&
              post.likes &&
              post.likes.includes(state.user._id) ? (
                <HeartFilled
                  onClick={() => handleUnlike(post._id)}
                  className="text-danger pt-2 h5 px-2"
                />
              ) : (
                <HeartOutlined
                  onClick={() => handleLike(post._id)}
                  className="text-danger pt-2 h5 px-2"
                />
              )}
              <div className="pt-2" style={{ marginRight: "1rem" }}>
                {post.likes.length} likes
              </div>
              <CommentOutlined
                onClick={() => handleComment(post)}
                className="text-danger pt-2 h5 px-2"
              />
              <div className="pt-2">
                <Link href={`/post/${post._id}`}>
                  {post.comments.length} comments
                </Link>
              </div>

              {state && state.user && state.user._id === post.postedBy._id && (
                <>
                  <EditOutlined
                    onClick={() => router.push(`/user/post/${post._id}`)}
                    className="text-danger pt-2 h5 px-2 mx-auto"
                  />
                  <DeleteOutlined
                    onClick={() => handleDelete(post)}
                    className="text-danger pt-2 h5 px-2"
                  />
                </>
              )}
            </div>
          </div>
          {/*  2 comments */}
          {post.comments && post.comments.length > 0 && (
            <ol
              className="list-group"
              style={{ maxHeight: "125px", overflow: "scroll" }}
            >
              {post.comments.slice(0, commentsCount).map((c) => (
                <li
                  key={c._id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div>
                      <Avatar
                        size={20}
                        className="mb-1 me-3"
                        src={imageSource(c.postedBy)}
                      />
                      {c.postedBy.name}
                    </div>
                    <i className="text-muted">{c.text}</i>
                  </div>
                  <span className="badge rounded-pill text-muted">
                    {moment(c.created).fromNow()}
                    {state &&
                      state.user &&
                      state.user._id === c.postedBy._id && (
                        <div className="me-auto mt-1">
                          <DeleteOutlined
                            onClick={() => removeComment(post._id, c._id)}
                            className="ps-2 text-danger"
                          />
                        </div>
                      )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
};

export default Post;
