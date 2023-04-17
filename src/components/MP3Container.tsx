import Image from "next/image";
import styles from "@/styles/MP3Container.module.css";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";

const loadIFrame = () => {
  const spotifyScript = document.createElement("script");
  spotifyScript.src = "https://open.spotify.com/embed-podcast/iframe-api/v1";
  spotifyScript.async = true;
  spotifyScript.id = "spotify-iframe-load";
  document.body.appendChild(spotifyScript);
};

export default function MP3Container() {
  const [spotifyLoading, setSpotifyLoading] = useState(true);

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      window.iframeapi = IFrameAPI;
      setTimeout(() => {
        setSpotifyLoading(false);
      }, 1000);
    };
    loadIFrame();
  }, []);

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
    <div className={styles.MP3Container}>
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
    </div>
  );
}
