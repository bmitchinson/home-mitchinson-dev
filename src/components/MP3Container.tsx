import Image from "next/image";
import styles from "@/styles/MP3Container.module.css";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import ModeSwitchBtn from "./ModeSwitchBtn";
import posts from "@/posts.json";

const getRandomPostID = (currentID = -1) => {
  let newID = Math.floor(Math.random() * posts.length);
  while (currentID == newID) {
    newID = Math.floor(Math.random() * posts.length);
  }
  return newID;
};

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
export default function MP3Container({
  switchToText,
  showMobileLayout,
  animateIn,
  animateOut,
  hide,
}: props) {
  const [spotifyLoading, setSpotifyLoading] = useState(true);
  const [themeRotation, setThemeRotation] = useState(undefined);
  const [postID, setPostID] = useState(getRandomPostID());
  const imageName = posts[postID].image;
  const song = posts[postID].song;

  const themeRotationMS = 8000;

  useEffect(() => {
    document.body.style.setProperty("background-color", posts[postID].color);
    // EmbedController.loadUri(episode.dataset.spotifyId);
  }, [postID]);

  const stopThemeRotate = () => {
    clearInterval(themeRotation);
  };
  const startThemeRotate = () => {
    const process = setInterval(() => {
      setPostID(getRandomPostID(postID));
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
    if (window.iframeapi) {
      // probably don't need this window assignment
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
      };
      window.iframeapi.createController(element, options, callback);
    }
  }, [spotifyLoading]);

  // todo: trigger the spotify loader when switching to MP3mode
  // otherwise there's an iFrame popin

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
          {spotifyLoading && (
            <div className={styles.SpotifyLoading}>
              <ScaleLoader
                id="scaleloader"
                color={posts[postID].color}
                loading
              />
            </div>
          )}
          {!spotifyLoading && (
            <>
              <div className={styles.SpotifyIFrameContainer}>
                <div id="spotify-iframe"></div>
              </div>
              <div className={styles.MP3Skip}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="skip icon" src="/skip.svg"></img>
              </div>
            </>
          )}
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
