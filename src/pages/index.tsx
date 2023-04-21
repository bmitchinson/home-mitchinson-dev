import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import MP3Container from "../components/MP3Container";
import TextSection from "../components/TextSection";
import { useEffect, useState } from "react";

//https://medium.com/swlh/using-window-matchmedia-for-media-queries-in-reactjs-97ddc66fca2e
export default function Home() {
  const [MP3Mode, setMP3Mode] = useState(false);

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

  // - no transitions for now
  // - ensure user can't scroll to see them offscreen, no x or y scroll
  const switchToTextMode = () => {
    //  add `position.......` to mp3container
    //  remove them from TextSection
    setMP3Mode(false);
  };

  const switchToMP3Mode = () => {
    //  remove `position: absolute` and `transform: translateX` from mp3container
    //  add those to TextSection (with a negative transform value)
    setMP3Mode(true);
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
                  hide={hideMP3}
                />
                <TextSection
                  showMobileLayout={showMobileLayout}
                  switchToMP3={switchToMP3Mode}
                  hide={hideText}
                />
              </>
            )}
          </div>
        </div>
        <div className={styles.Footer}>
          <p>
            Built in Denver, CO <span className={styles.FooterEmoji}>⛰️</span>
          </p>
        </div>
      </div>
    </>
  );
}
