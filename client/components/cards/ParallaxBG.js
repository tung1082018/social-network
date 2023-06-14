const ParallaxGB = ({ url, children = "" }) => {
  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: "url(" + url + ")",
        backgroundAttachment: "fixed",
        padding: "100px 0px 75px 0px",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        display: "block",
        height: "200px",
      }}
    >
      <h1 className="display-1 fw-light text-center">{children}</h1>
    </div>
  );
};

export default ParallaxGB;
