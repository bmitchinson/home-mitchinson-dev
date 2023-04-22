import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import MP3Container from "../components/MP3Container";
import TextSection from "../components/TextSection";
import posts from "@/posts.json";
import { useEffect, useState } from "react";

const getRandomPostID = (currentID = -1) => {
  let newID = Math.floor(Math.random() * posts.length);
  while (currentID == newID) {
    newID = Math.floor(Math.random() * posts.length);
  }
  return newID;
};

//https://medium.com/swlh/using-window-matchmedia-for-media-queries-in-reactjs-97ddc66fca2e
export default function Home() {
  const [postID, setPostID] = useState(getRandomPostID());

  const imageRotationMS = 8000;
  useEffect(() => {
    setInterval(() => {
      setPostID(getRandomPostID(postID));
    }, imageRotationMS);
  }, []);

  const [MP3Mode, setMP3Mode] = useState(false);
  const [animateMP3In, setAnimateMP3In] = useState(false);
  const [animateMP3Out, setAnimateMP3Out] = useState(false);
  const animationLength = 800;

  const mobileBreakpoint = 52.01;
  const [mQuery, setMQuery] = useState<{ matches?: boolean }>({
    matches: undefined,
  });

  useEffect(() => {
    // https://stackoverflow.com/a/42061290
    const fontSize = getComputedStyle(document.querySelector("body")!)[
      "font-size" as any
    ] as string;
    const widthInRem = window.innerWidth / parseFloat(fontSize);
    setMQuery({
      matches: widthInRem > mobileBreakpoint ? true : false,
    });
    let mediaQuery = window.matchMedia(`(min-width: ${mobileBreakpoint}rem)`);
    mediaQuery.addListener(setMQuery);
    return () => mediaQuery.removeListener(setMQuery);
  }, []);

  const showMobileLayout = mQuery && !mQuery.matches;

  useEffect(() => {
    document.body.style.setProperty("background-color", posts[postID].color);
  }, [postID]);

  const switchToMP3Mode = () => {
    setAnimateMP3In(true);
    setTimeout(() => {
      setMP3Mode(true);
      setAnimateMP3In(false);
    }, animationLength);
  };

  const switchToTextMode = () => {
    setAnimateMP3Out(true);
    setTimeout(() => {
      setMP3Mode(false);
      setAnimateMP3Out(false);
    }, animationLength);
  };

  const hideMP3 = showMobileLayout && !MP3Mode;
  const hideText = showMobileLayout && MP3Mode;

  return (
    <>
      <Head>
        <title>Ben Mitchinson</title>
        <meta name="description" content="Ben Mitchinson" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.FooterStick}>
        <div className={styles.VertCenter}>
          <div className={styles.HoriCenter}>
            {mQuery.matches != undefined && (
              <>
                <MP3Container
                  showMobileLayout={showMobileLayout}
                  switchToText={switchToTextMode}
                  animateIn={animateMP3In}
                  animateOut={animateMP3Out}
                  hide={hideMP3}
                  // todo: include color here for loading as well
                  song={posts[postID].song}
                  // todo: fade nextjs image to next image somehow?
                  // so that it doesn't snap?
                  imageName={posts[postID].image}
                />
                <TextSection
                  showMobileLayout={showMobileLayout}
                  switchToMP3={switchToMP3Mode}
                  animateIn={animateMP3Out}
                  animateOut={animateMP3In}
                  hide={hideText}
                />
              </>
            )}
          </div>
        </div>
        {/* https://css-tricks.com/couple-takes-sticky-footer/ */}
        <div className={styles.Footer}>
          <p>
            Built in Denver, CO <span className={styles.FooterEmoji}>⛰️</span>
          </p>
        </div>
      </div>
    </>
  );
}
