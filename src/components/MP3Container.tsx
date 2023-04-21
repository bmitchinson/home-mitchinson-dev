import Image from "next/image";
import styles from "@/styles/MP3Container.module.css";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import ModeSwitchBtn from "./ModeSwitchBtn";

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
}

export default function MP3Container({
  switchToText,
  showMobileLayout,
  animateIn,
  animateOut,
  hide,
}: props) {
  const [spotifyLoading, setSpotifyLoading] = useState(true);

  useEffect(() => {
    if (!window.onSpotifyIframeApiReady) {
      window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
        window.iframeapi = IFrameAPI;
        setTimeout(() => {
          setSpotifyLoading(false);
        }, 1000);
      };
      loadIFrame();
    }
  }, []);

  // todo: show spotify loading when animation is happening? reset after
  // animation is done?
  // animate opacity to prevent pop in?
  useEffect(() => {});

  useEffect(() => {
    if (window.iframeapi) {
      // probably don't need this window assignment
      const element = document.getElementById("spotify-iframe");
      const options = {
        width: "100%",
        height: "80",
        uri: "spotify:track:6ck3DxsDE4Wmrhi3bTvoJ1",
      };
      const callback = (EmbedController: any) => {
        EmbedController.addListener("playback_update", (e: any) => {
          // console.log("UPDATE:", e); // e.data.isPaused
        });
        // wire loadUri / save reference to loadUri?
        // EmbedController.loadUri(episode.dataset.spotifyId);
      };
      window.iframeapi.createController(element, options, callback);
    }
  }, [spotifyLoading]);

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
          {spotifyLoading && (
            <div className={styles.SpotifyLoading}>
              {/* todo: make color theme dependent */}
              <ScaleLoader id="scaleloader" color="#4B73BC" loading />
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
