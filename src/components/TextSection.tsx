import styles from "@/styles/TextSection.module.css";
import ModeSwitchBtn from "@/components/ModeSwitchBtn";

interface post {
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
}

export default function TextSection({
  showMobileLayout,
  switchToMP3,
  animateIn,
  animateOut,
  hide,
  posts,
}: props) {
  const greetingLine = (
    <div className={styles.HeyLine}>
      <p className={styles.HeyLineText}>Hey!</p>
      <span className={styles.HeyLineHand}>👋</span>
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
          {links}
          <div className={styles.Center}>
            {greetingLine}
            {mockCurrentlyWorkingOn}
            {blogPosts(posts)}
          </div>
        </>
      )}
      {!showMobileLayout && (
        <>
          {greetingLine}
          {mockCurrentlyWorkingOn}
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

const mockCurrentlyWorkingOn = (
  <>
    <p>{"I'm currently working on"}</p>
    <ul>
      <li>Juno, a k8s environment built with CDKTF to deploy UrbanOS</li>
      <li>Practicing electric guitar</li>
    </ul>
  </>
);
