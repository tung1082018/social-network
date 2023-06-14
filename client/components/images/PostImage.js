const PostImage = ({ url }) => {
  return (
    <div
      style={{
        backgroundImage: "url(" + url + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        height: "300px",
      }}
    />
  );
};

export default PostImage;
