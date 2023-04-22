import Image from "next/image";
import styles from "@/styles/MP3Container.module.css";
import { use, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import ModeSwitchBtn from "./ModeSwitchBtn";
import posts from "@/posts.json";
import { animationLength } from "../pages";

const getRandomPostID = () => Math.floor(Math.random() * posts.length);
const getNextPostID = (postID) => (postID + 1) % posts.length;

const loadIFrame = () => {
  const spotifyScript = document.createElement("script");
  spotifyScript.src = "https://open.spotify.com/embed-podcast/iframe-api/v1";
  spotifyScript.async = true;
  spotifyScript.id = "spotify-iframe-load";
  document.body.appendChild(spotifyScript);
};

interface props {
  switchToText: () => void;
  showMobileLayout: boolean;
  animateIn: boolean;
  animateOut: boolean;
  hide: boolean;
  imageName: string;
  song: string;
}

// todo: fade nextjs image to next image somehow? so that it doesn't snap?
// todo: fade out the spotify iframe on them change? snaps to loading
// refactor: this component is getting a bit out of hand, effects condensed
//   at least
export default function MP3Container({
  switchToText,
  showMobileLayout,
  animateIn,
  animateOut,
  hide,
}: props) {
  const [spotifyLoading, setSpotifyLoading] = useState(true);
  const [embedController, setEmbedController] = useState(undefined);
  const [themeRotation, setThemeRotation] = useState(undefined);
  const [postID, setPostID] = useState(getRandomPostID());
  const imageName = posts[postID].image;
  const song = posts[postID].song;

  const themeRotationMS = 8000;

  useEffect(() => {
    document.body.style.setProperty("background-color", posts[postID].color);
    if (embedController) {
      embedController.loadUri(`spotify:track:${posts[postID].song}`);
    }
    setSpotifyLoading(true);
    setTimeout(() => {
      setSpotifyLoading(false);
    }, animationLength + 300);
  }, [postID]);

  const stopThemeRotate = () => {
    clearInterval(themeRotation);
  };
  const startThemeRotate = () => {
    const process = setInterval(() => {
      setPostID((postID) => getNextPostID(postID));
    }, themeRotationMS);

    setThemeRotation(process);
    return () => {
      clearInterval(process);
    };
  };

  useEffect(() => startThemeRotate(), []);

  useEffect(() => {
    if (!window.onSpotifyIframeApiReady) {
      window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
        window.iframeapi = IFrameAPI;
        setTimeout(() => {
          setSpotifyLoading(false);
        }, 1200);
      };
      loadIFrame();
    }
  }, []);

  useEffect(() => {
    if (window.iframeapi && !embedController) {
      const element = document.getElementById("spotify-iframe");
      const options = {
        width: "100%",
        height: "80",
        uri: `spotify:track:${song}`,
      };
      const callback = (EmbedController: any) => {
        EmbedController.addListener("playback_update", (e: any) => {
          if (e.data.isPaused) {
            startThemeRotate();
          } else if (!e.data.isPaused && themeRotation) {
            stopThemeRotate();
          }
        });
        setEmbedController(EmbedController);
      };
      window.iframeapi.createController(element, options, callback);
    }
  }, [spotifyLoading]);

  useEffect(() => {
    setSpotifyLoading(true);
    setTimeout(() => {
      setSpotifyLoading(false);
    }, animationLength + 500);
  }, [animateIn]);

  const spotifyVisibility = spotifyLoading ? { visibility: "hidden" } : {};

  return (
    <div
      className={`${styles.MP3Container} 
      ${hide ? styles.MP3ContainerHidden : ""}
      ${animateIn ? styles.MP3AnimateIn : ""}
      ${animateOut ? styles.MP3AnimateOut : ""}
      `}
    >
      <div className={styles.MP3Player}>
        <div className={styles.MP3CoverArt}>
          <Image
            src={`/post_imgs/${imageName}.jpg`}
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
          <div className={styles.SpotifyLoading}>
            <ScaleLoader id="scaleloader" color={posts[postID].color} loading />
          </div>
          <div
            className={styles.SpotifyIFrameContainer}
            style={spotifyVisibility}
          >
            <div id="spotify-iframe"></div>
          </div>
          <div className={styles.MP3Skip}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="skip icon" src="/skip.svg"></img>
          </div>
        </div>
      </div>
      {showMobileLayout && (
        <div className={styles.ModeSwitchRow}>
          <ModeSwitchBtn switchMode={switchToText} faceBackward />
        </div>
      )}
    </div>
  );
}
