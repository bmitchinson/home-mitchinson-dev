import styles from "@/styles/TextSection.module.css";
import ModeSwitchBtn from "@/components/ModeSwitchBtn";
import HeyHand from "./HeyHand";

export interface post {
  title: string;
  url: string;
}

interface props {
  showMobileLayout: boolean;
  switchToMP3: () => void;
  animateIn: boolean;
  animateOut: boolean;
  hide: boolean;
  posts: post[];
  currentWork: string[];
}

const getCurrentWorkJSX = (currentWork: string[]) => {
  return (
    <>
      <p>{"I'm currently working on"}</p>
      <ul>
        {currentWork.map((line, index) => {
          // http://gist.github.com/alordiel/ed8587044be07e408f5f93b3124836b3
          // let links = [] as { txt: string; url: string }[];
          // let i = 0;

          // while (i < line.length) {
          //   let start = line.indexOf("[", i);
          //   let end = line.indexOf("]", i);
          //   if (start !== -1 && end !== -1) {
          //     let txt = line.slice(start + 1, end);
          //     let url = line.slice(end + 2, line.indexOf(")", end));
          //     links.push({ txt, url });
          //     i = end + 1;
          //   } else {
          //     break;
          //   }
          // }

          // links.forEach((link) => {
          //   line = line.replace(
          //     `[${link.txt}](${link.url})`,
          //     `<a href="${link.url}" target="_blank">${link.txt}</a>`
          //   );
          // });

          let links = line.match(/\[.*?\)/g);
          if (links?.length) {
            links.forEach((link) => {
              let txt = link.match(/\[(.*?)\]/)![1] ?? ""; //get only the txt
              let url = link.match(/\((.*?)\)/)![1] ?? ""; //get only the link
              line = line.replace(
                link,
                '<a href="' + url + '" target="_blank">' + txt + "</a>"
              );
            });
          }

          // note: for link in links replace

          return (
            <li
              key={`work-${index}`}
              dangerouslySetInnerHTML={{ __html: line }}
            ></li>
          );
        })}
      </ul>
    </>
  );
};

export default function TextSection({
  showMobileLayout,
  switchToMP3,
  animateIn,
  animateOut,
  hide,
  posts,
  currentWork,
}: props) {
  const greetingLine = (
    <div className={styles.HeyLine}>
      <p className={styles.HeyLineText}>Hey!</p>
      <HeyHand />
      {showMobileLayout && (
        <div className={styles.ModeSwitchOffset}>
          <ModeSwitchBtn onClick={switchToMP3} />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`${styles.TextSection} 
      ${hide ? styles.TextSectionHidden : ""} 
      ${animateOut ? styles.TextAnimateOut : ""}
      ${animateIn ? styles.TextAnimateIn : ""}
      `}
    >
      {showMobileLayout && (
        <>
          <div className={styles.CenterHorizontal}>{links}</div>
          <div className={styles.Center}>
            {greetingLine}
            {getCurrentWorkJSX(currentWork)}
            {blogPosts(posts)}
          </div>
        </>
      )}
      {!showMobileLayout && (
        <>
          {greetingLine}
          {getCurrentWorkJSX(currentWork)}
          {blogPosts(posts)}
          {links}
        </>
      )}
    </div>
  );
}

const links = (
  <div className={styles.Links}>
    <a href={""}>Github</a> - <a href={""}>Twitter</a>
    {" - "}
    <a href={""}>Resume</a> - <a href={""}>Spotify</a>
  </div>
);

const blogPosts = (posts: post[]) => (
  <>
    <p>
      Recent Writing - <a href={"https://blog.mitchinson.dev"}>Blog</a>
    </p>
    <ul className={styles.BlogPosts}>
      {posts.map((post) => {
        return (
          <li key={post.title}>
            <a href={`${post.url}`}>{post.title}</a>
          </li>
        );
      })}
    </ul>
  </>
);
