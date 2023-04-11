import Head from "next/head";
import Image from "next/image";
// todo: correct font + drop shadow
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect } from "react";
// const inter = Inter({ subsets: ["latin"] });

const loadIFrame = () => {
  const spotifyScript = document.createElement("script");
  spotifyScript.src = "https://open.spotify.com/embed-podcast/iframe-api/v1";
  spotifyScript.async = true;
  spotifyScript.id = "spotify-iframe-load";
  document.body.appendChild(spotifyScript);
};

// https://stackoverflow.com/questions/39235506/render-component-in-different-order-depending-on-screen-size-react
export default function Home() {
  useEffect(() => {
    console.log("Wiring onApiReady");
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      console.log("On ready called");
      window.iframeapi = IFrameAPI;
      const element = document.getElementById("spotify-iframe");
      const options = {
        width: "100%",
        height: "80",
        uri: "spotify:track:6ck3DxsDE4Wmrhi3bTvoJ1",
      };
      const callback = (EmbedController) => {
        EmbedController.addListener("playback_update", (e) => {
          // console.log("UPDATE:", e); // e.data.isPaused
        });
        // wire loadUri / save reference to loadUri?
        // EmbedController.loadUri(episode.dataset.spotifyId);
      };
      IFrameAPI.createController(element, options, callback);
    };
    loadIFrame();
  }, []);

  return (
    <>
      <Head>
        <title>Ben Mitchinson</title>
        <meta name="description" content="Ben Mitchinson" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.FooterStick}>
          <div className={styles.VertCenter}>
            <div className={styles.RowCenter}>
              <div className={styles.MP3Section}>
                <div className={styles.MP3CoverArt}>
                  <Image
                    src={"/test_img_1.png"}
                    alt="image"
                    width={1000}
                    height={1000}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  ></Image>
                </div>
                <div className={styles.MP3Controls}>
                  <div className={styles.SpotifyIFrameContainer}>
                    <div id="spotify-iframe"></div>
                  </div>
                  <div className={styles.MP3Skip}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="skip icon" src="/skip.svg"></img>
                  </div>
                </div>
              </div>
              <div className={styles.TextSection}>
                <p>Hey!👋🏼</p>
                <p>{"I'm currently working on"}</p>
                <ul>
                  <li>
                    Juno, a k8s environment built with CDKTF to deploy UrbanOS
                  </li>
                  <li>Practicing electric guitar</li>
                </ul>
                <p>
                  Recent Writing -{" "}
                  <a href={"https://blog.mitchinson.dev"}>Blog</a>
                </p>
                <ul>
                  <li>
                    <a href={""}>Classes 2019</a>
                  </li>
                  <li>
                    <a href={""}>Classes 2019</a>
                  </li>
                  <li>
                    <a href={""}>Classes 2019</a>
                  </li>
                </ul>
                <p>
                  <a href={""}>Github</a> - <a href={""}>Twitter</a>
                  {" - "}
                  <a href={""}>Resume</a> - <a href={""}>Spotify</a>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.Footer}>Built in Denver, CO ⛰️</div>
        </div>
      </main>
    </>
  );
}
