import React from "react";
import { SyncOutlined } from "@ant-design/icons";

const AuthForm = ({
  handleSubmit,
  profileUpdate,
  username,
  setUsername,
  about,
  setAbout,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  secret,
  setSecret,
  loading,
  page,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {profileUpdate && (
        <>
          <div className="form-group p-2">
            <label className="form-label text-muted">
              <small>Username</small>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group p-2">
            <label className="form-label text-muted">
              <small>About</small>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
        </>
      )}

      {page !== "login" && (
        <div className="form-group p-2">
          <label className="form-label text-muted">
            <small>Your name</small>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <div className="form-group p-2">
        <label className="form-label text-muted">
          <small>Email address</small>
        </label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={profileUpdate}
        />
      </div>

      <div className="form-group p-2">
        <label className="form-label text-muted">
          <small>Password</small>
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {page !== "login" && (
        <>
          <div className="form-group p-2">
            <label className="form-label text-muted">
              <small>Pick a question</small>
            </label>
            <select className="form-control">
              <option>What is your favourite color?</option>
              <option>What is your best friend's name?</option>
              <option>What city you were born?</option>
            </select>
            <small className="form-text text-muted">
              You can use this to reset your password if forgotten.
            </small>
          </div>

          <div className="form-group p-2">
            <input
              type="text"
              className="form-control"
              placeholder="Write your answer here"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="form-group p-2">
        <button
          disabled={
            profileUpdate
              ? loading
              : page === "login"
              ? !email || !password || loading
              : !name || !email || !secret || !password || loading
          }
          className="btn btn-primary col-12"
        >
          {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
