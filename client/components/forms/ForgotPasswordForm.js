import { SyncOutlined } from "@ant-design/icons";

const ForgotPasswordForm = ({
  handleSubmit,
  email,
  setEmail,
  newPassword,
  setNewPassword,
  secret,
  setSecret,
  loading,
}) => {
  return (
    <form onSubmit={handleSubmit}>
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
        />
      </div>

      <div className="form-group p-2">
        <label className="form-label text-muted">
          <small>New password</small>
        </label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

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

      <div className="form-group p-2">
        <button
          disabled={!email || !newPassword || !secret || loading}
          className="btn btn-primary col-12"
        >
          {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
