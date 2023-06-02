import Image from "next/image";
import styles from "@/styles/MP3Container.module.css";
import { CSSProperties, use, useEffect, useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";
import ModeSwitchBtn from "./ModeSwitchBtn";
import posts from "@/posts.json";
import { animationLength } from "../pages";
import Tilt from "react-parallax-tilt";

const getRandomPostID = () => Math.floor(Math.random() * posts.length);
const getNextPostID = (postID: number) => (postID + 1) % posts.length;

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

// refactor: this component is getting a bit out of hand, effects condensed
//   at least. Theme context? How can I clean up effects?
export default function MP3Container({
  switchToText,
  showMobileLayout,
  animateIn,
  animateOut,
  hide,
}: props) {
  const [spotifyLoading, setSpotifyLoading] = useState(true);
  const [embedController, setEmbedController] = useState(undefined as any);
  const [themeRotation, setThemeRotation] = useState<NodeJS.Timer | undefined>(
    undefined
  );
  // https://stackoverflow.com/a/60643670
  const themeRotationRef = useRef<NodeJS.Timer | undefined>();
  themeRotationRef.current = themeRotation;

  const [postID, setPostID] = useState(getRandomPostID());
  const { image, song, color } = posts[postID];

  const themeRotationMS = 8000;

  useEffect(() => {
    document.body.style.setProperty("background-color", color);
    if (embedController) {
      embedController.loadUri(`spotify:track:${song}`);
    }
    setSpotifyLoading(true);
    setTimeout(() => {
      setSpotifyLoading(false);
    }, animationLength + 300);
  }, [postID]);

  const stopThemeRotate = () => {
    clearInterval(themeRotationRef.current);
    setThemeRotation(undefined);
  };

  const startThemeRotate = () => {
    if (!themeRotationRef.current) {
      const process = setInterval(() => {
        setPostID(getNextPostID);
      }, themeRotationMS);

      setThemeRotation(process);
      return () => {
        clearInterval(process);
        setThemeRotation(undefined);
      };
    }

    return () => {};
  };

  useEffect(startThemeRotate, []);

  const resetThemeRotate = () => {
    stopThemeRotate();
    startThemeRotate();
  };

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

  const spotifyVisibility = spotifyLoading
    ? // why do I need to cast this as CSSProp. Don't need that for `flipStyle`
      ({ visibility: "hidden" } as CSSProperties)
    : undefined;

  const imageComp = (
    <div className={styles.MP3CoverArt}>
      <Image
        src={`/post_imgs/${image}.jpg`}
        alt="image"
        width={1000}
        height={1000}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      ></Image>
    </div>
  );

  return (
    <div
      className={`${styles.MP3Container} 
      ${hide ? styles.MP3ContainerHidden : ""}
      ${animateIn ? styles.MP3AnimateIn : ""}
      ${animateOut ? styles.MP3AnimateOut : ""}
      `}
    >
      <div className={styles.MP3Player}>
        {showMobileLayout && imageComp}
        {!showMobileLayout && (
          <Tilt tiltReverse={true} tiltMaxAngleX={6} tiltMaxAngleY={6}>
            {imageComp}
          </Tilt>
        )}
        <div className={styles.MP3Controls}>
          <div className={styles.SpotifyLoading}>
            <ScaleLoader id="scaleloader" color={color} loading />
          </div>
          <div
            className={styles.SpotifyIFrameContainer}
            style={spotifyVisibility}
          >
            <div id="spotify-iframe"></div>
          </div>
          <div className={styles.MP3Skip}>
            <button
              onClick={() => {
                setPostID(getNextPostID);
                resetThemeRotate();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="skip icon" src="/skip.svg"></img>
            </button>
          </div>
        </div>
      </div>
      {showMobileLayout && (
        <div className={styles.ModeSwitchRow}>
          <ModeSwitchBtn onClick={switchToText} faceBackward />
        </div>
      )}
    </div>
  );
}
