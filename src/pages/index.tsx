import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import MP3Container from "../components/MP3Container";
import TextSection from "../components/TextSection";
import { useEffect, useState } from "react";

//https://medium.com/swlh/using-window-matchmedia-for-media-queries-in-reactjs-97ddc66fca2e
export default function Home() {
  const animationLength = 800;

  const [MP3Mode, setMP3Mode] = useState(false);
  const [animateMP3In, setAnimateMP3In] = useState(false);
  const [animateMP3Out, setAnimateMP3Out] = useState(false);
  const [animateTextIn, setAnimateTextIn] = useState(false);
  const [animateTextOut, setAnimateTextOut] = useState(false);

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

  const switchToMP3Mode = () => {
    setAnimateMP3In(true);
    setAnimateTextOut(true);
    setTimeout(() => {
      setMP3Mode(true);
      setAnimateMP3In(false);
      setAnimateTextOut(false);
    }, animationLength);
  };

  const switchToTextMode = () => {
    setAnimateTextIn(true);
    setAnimateMP3Out(true);
    setTimeout(() => {
      // question: can set set timeout be moved out? It's essentially a cleanup?
      // at least the animations being set to false can.
      setMP3Mode(false);
      setAnimateTextIn(false);
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
                />
                <TextSection
                  showMobileLayout={showMobileLayout}
                  switchToMP3={switchToMP3Mode}
                  animateIn={animateTextIn}
                  animateOut={animateTextOut}
                  hide={hideText}
                />
              </>
            )}
          </div>
        </div>
        {/* https://css-tricks.com/couple-takes-sticky-footer/ */}
        <div className={styles.Footer}>
          {/* todo: footer shakes during mobile animation */}
          {/* caught on chrome SE simulator */}
          <p>
            Built in Denver, CO <span className={styles.FooterEmoji}>⛰️</span>
          </p>
        </div>
      </div>
    </>
  );
}
