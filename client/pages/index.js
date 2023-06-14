import { useEffect, useState } from "react";
import ParallaxBG from "../components/cards/ParallaxBG";
import axios from "axios";
import Link from "next/link";
import PostPublic from "../components/cards/PostPublic";
import Head from "next/head";

import { io } from "socket.io-client";
const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true,
});

const Home = ({ posts }) => {
  const [newsFeed, setNewsFeed] = useState([]);

  // useEffect(() => {
  //   // console.log("SOCKETIO ON JOIN", socket);
  //   socket.on("receive-message", (newMessage) => {
  //     alert(newMessage);
  //   });
  // }, []);

  useEffect(() => {
    socket.on("new-post", (newPost) => {
      // notification or render the new post on the page
      setNewsFeed([newPost, ...posts]);
    });
  }, []);

  const head = () => (
    <Head>
      <title>SOCIAL NETWORK - A social network by devs for devs</title>
      <meta
        name="description"
        content="A social network by developers for other developers"
      />
      <meta
        property="og:description"
        content="A social network by developers for other developers"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="SocialNetwork" />
      <meta property="og:url" content="http://merncamp.com" />
      <meta
        property="og:image:secure_url"
        content="http://merncamp.com/images/default.jpg"
      />
    </Head>
  );

  const collection = newsFeed.length > 0 ? newsFeed : posts;

  return (
    <>
      {head()}
      <ParallaxBG url="/images/default.jpg" width='300'>     
      
      </ParallaxBG>

      <div className="container">
        {/*<button onClick={() => socket.emit("send-message", "This is khoiv!!!")}>*/}
        {/*  Send message*/}
        {/*</button>*/}
        <div className="row pt-5">
          {collection.map((post) => (
            <div key={post._id} className="col-md-4">
              <Link href={`/post/view/${post._id}`}>
                <PostPublic post={post} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { data } = await axios.get("http://localhost:8000/api/posts");
  // console.log(data);
  return {
    props: {
      posts: data, // will be passed to the page component as props
    },
  };
}

export default Home;
