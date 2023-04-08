import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

// const inter = Inter({ subsets: ["latin"] });
// https://stackoverflow.com/questions/39235506/render-component-in-different-order-depending-on-screen-size-react
export default function Home() {
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
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image
                    src={"/test_img_1.png"}
                    width={1000}
                    height={1000}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  ></Image>
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
