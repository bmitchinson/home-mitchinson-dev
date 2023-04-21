import styles from "@/styles/ModeSwitchBtn.module.css";

interface props {
  switchMode: () => void;
  faceBackward?: boolean;
}

export default function ModeSwitchBtn({
  switchMode: switchToMP3,
  faceBackward = false,
}: props) {
  const flipStyle = faceBackward ? { transform: "scaleX(-1)" } : {};

  return (
    <div className={styles.ModeSwitchContainer} style={flipStyle}>
      <div className={styles.ModeSwitch}>
        <button onClick={switchToMP3}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="skip icon" src="/skip.svg"></img>
        </button>
      </div>
    </div>
  );
}
