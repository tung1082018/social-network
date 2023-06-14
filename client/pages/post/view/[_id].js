import axios from "axios";
import Head from "next/head";
import PostPublic from "../../../components/cards/PostPublic";
import ParallaxBG from "../../../components/cards/ParallaxBG";

const SinglePost = ({ post }) => {
  const head = () => (
    <Head>
      <title>SOCIAL NETWORK - A social network by devs for devs</title>
      <meta name="description" content={post.content} />
      <meta
        property="og:description"
        content="A social network by developers for other developers"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="SocialNetwork" />
      <meta
        property="og:url"
        content={`http://merncamp.com/post/view/{${post._id}`}
      />
      <meta property="og:image:secure_url" content={imageSource(post)} />
    </Head>
  );

  const imageSource = (post) => {
    if (post.image) return post.image.url;
    return "/images/default.jpg";
  };

  return (
    <>
      {head()}
      <ParallaxBG url="/images/default.jpg">SOCIAL NETWORK</ParallaxBG>

      <div className="container">
        <div className="row pt-5">
          <div key={post._id} className="col-md-8 offset-md-2">
            <PostPublic post={post} />
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { data } = await axios.get(`/post/${context.params._id}`);
  // console.log(data);
  return {
    props: {
      post: data, // will be passed to the page component as props
    },
  };
}

export default SinglePost;
