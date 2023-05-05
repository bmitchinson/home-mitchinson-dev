import styles from "@/styles/HeyHand.module.css";
import { useState } from "react";

export default function HeyHand() {
  const [animating, setAnimating] = useState(false);

  const onMouseEnter = () => {
    setAnimating(true);
  };

  const onMouseLeave = () => {
    setAnimating(false);
  };

  const animationStyle = animating ? styles.HeyLineAnimate : "";

  return (
    <span
      id={"waving-hand"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${styles.HeyLineHand} ${animationStyle}`}
    >
      👋
    </span>
  );
}
