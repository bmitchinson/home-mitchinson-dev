import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import MP3Container from "../components/MP3Container";
import TextSection from "../components/TextSection";
import { useEffect, useState } from "react";

//https://medium.com/swlh/using-window-matchmedia-for-media-queries-in-reactjs-97ddc66fca2e
export default function Home() {
  const mobileBreakpoint = 52.01;
  const [mQuery, setMQuery] = useState();

  useEffect(() => {
    // https://stackoverflow.com/a/42061290
    const widthInRem =
      window.innerWidth /
      parseFloat(getComputedStyle(document.querySelector("body"))["font-size"]);
    setMQuery({
      matches: widthInRem > mobileBreakpoint ? true : false,
    });
    let mediaQuery = window.matchMedia(`(min-width: ${mobileBreakpoint}rem)`);
    mediaQuery.addListener(setMQuery);
    return () => mediaQuery.removeListener(setMQuery);
  }, []);

  const showMobileLayout = mQuery && !mQuery.matches;
  const showDesktopLayout = !showMobileLayout;

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
            <MP3Container />
            <TextSection showMobileLayout={showMobileLayout} />
          </div>
        </div>
        <div className={styles.Footer}>Built in Denver, CO ⛰️</div>
      </div>
    </>
  );
}
