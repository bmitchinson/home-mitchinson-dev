import styles from "@/styles/TextSection.module.css";
import ModeSwitchBtn from "@/components/ModeSwitchBtn";

interface props {
  showMobileLayout: boolean;
  switchToMP3: () => void;
  hide: boolean;
}

export default function TextSection({
  showMobileLayout,
  switchToMP3,
  hide,
}: props) {
  const greetingLine = (
    <div className={styles.HeyLine}>
      <p className={styles.HeyLineText}>Hey!</p>
      <span className={styles.HeyLineHand}>👋</span>
      {showMobileLayout && (
        <div className={styles.ModeSwitchOffset}>
          <ModeSwitchBtn switchMode={switchToMP3} />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`${styles.TextSection} ${
        hide ? styles.TextSectionHidden : ""
      }`}
    >
      {showMobileLayout && (
        <>
          {links}
          <div className={styles.Center}>
            {greetingLine}
            {mockCurrentlyWorkingOn}
            {mockBlogPosts}
          </div>
        </>
      )}
      {!showMobileLayout && (
        <>
          {greetingLine}
          {mockCurrentlyWorkingOn}
          {mockBlogPosts}
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

const mockBlogPosts = (
  <>
    <p>
      Recent Writing - <a href={"https://blog.mitchinson.dev"}>Blog</a>
    </p>
    <ul className={styles.BlogPosts}>
      <li>
        <a href={""}>Classes 2019</a>
      </li>
      <li>
        <a href={""}>Accenture March 2021</a>
      </li>
      <li>
        <a href={""}>
          Jest: Class mocks are the cutoff text testing testing 123
        </a>
      </li>
      <li>
        <a href={""}>Classes 2020</a>
      </li>
      <li>
        <a href={""}>Device Advice Year 3</a>
      </li>
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
