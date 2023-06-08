import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import MP3Container from "../components/MP3Container";
import TextSection, { post } from "../components/TextSection";
import { useEffect, useState } from "react";
import { Client } from "@notionhq/client";
import { Config } from "../utils/configuration";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { NextPageContext } from "next";

interface props {
  posts: post[];
  currentWork: string[];
}

const fetchBlock = async (blockId: string) => {
  const options = {
    headers: {
      Authorization: `Bearer ${Config.notionAPIKey}`,
      "Notion-Version": "2022-02-22",
    },
  };
  return fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, options);
};

const notionPostQuery: QueryDatabaseParameters = {
  database_id: Config.postsDatabaseID,
  filter: {
    and: [
      {
        property: "status",
        select: {
          equals: "Published",
        },
      },
      {
        property: "type",
        select: {
          equals: "Post",
        },
      },
    ],
  },
  sorts: [
    {
      property: "date",
      direction: "descending",
    },
  ],
};

export const animationLength = 800;

export const getCurrentWork = async (
  notionClient: Client
): Promise<string[]> => {
  return fetchBlock(Config.currentWorkPageID)
    .then((res) => res.json())
    .then((res) => {
      return res.results
        .filter((r: any) => r.bulleted_list_item)
        .map((r: any) => r.bulleted_list_item.rich_text)
        .map((r: any) => {
          const result = r.reduce((acc: string, r: any) => {
            if (r.href) {
              acc += `[${r.plain_text}](${r.href})`;
            } else {
              acc += r.plain_text;
            }
            return acc;
          }, "");
          return result;
        });
    });
};

// smell: Having this big of a function on the main page when only
//   one component uses it seems weird. Is this what a react server
//   component would fix? Other ways to solve it in the meantime?

// shouldn't this be co-located in the text section component? Because if it's
//   not, the whole page won't be statically generated, right? Since the top
//   component in the tree has getServerSideProps present?
// https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization
export async function getServerSideProps(context: NextPageContext) {
  const notion = new Client({
    auth: Config.notionAPIKey,
  });

  const posts = await notion.databases.query(notionPostQuery);
  const currentWork = await getCurrentWork(notion);

  const postsSlugAndTitle = posts.results.slice(0, 5).map((post) => {
    const p = post as any;
    return {
      url: `${Config.blogURL}/${p.properties.slug.rich_text[0].plain_text}`,
      title: p.properties.title.title[0].plain_text,
    };
  });

  return {
    props: {
      posts: postsSlugAndTitle,
      currentWork: currentWork,
    },
  };
}

//https://medium.com/swlh/using-window-matchmedia-for-media-queries-in-reactjs-97ddc66fca2e
export default function Home({ posts, currentWork }: props) {
  const [MP3Mode, setMP3Mode] = useState(false);
  const [animateMP3In, setAnimateMP3In] = useState(false);
  const [animateMP3Out, setAnimateMP3Out] = useState(false);

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
        <meta name="description" content={"Info about Ben Mitchinson"} />
        <meta property="og:title" content={"Ben Mitchinson"} />
        <meta property="og:description" content={"Info about Ben Mitchinson"} />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dheqbiqti/image/upload/v1686186735/home.mitchinson.dev/homeogmeta.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dheqbiqti/image/upload/v1686186735/home.mitchinson.dev/homeogmeta.png"
        />
      </Head>
      <div className={styles.FooterStick}>
        <div className={styles.VertCenter}>
          <div className={styles.HoriCenter}>
            {mQuery.matches != undefined && (
              <>
                <MP3Container
                  switchToText={switchToTextMode}
                  showMobileLayout={showMobileLayout}
                  animateIn={animateMP3In}
                  animateOut={animateMP3Out}
                  hide={hideMP3}
                />
                <TextSection
                  showMobileLayout={showMobileLayout}
                  switchToMP3={switchToMP3Mode}
                  animateIn={animateMP3Out}
                  animateOut={animateMP3In}
                  hide={hideText}
                  posts={posts}
                  currentWork={currentWork}
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
