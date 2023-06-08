import styles from "@/styles/HeyHand.module.css";
import { useEffect, useState } from "react";

export default function HeyHand() {
  const [animating, setAnimating] = useState(false);

  const onMouseEnter = () => {
    setAnimating(true);
  };

  const onMouseLeave = () => {
    setAnimating(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimating(true);
    }, 1500);
    setTimeout(() => {
      setAnimating(false);
    }, 4300);
  }, []);

  const animationStyle = animating ? styles.HeyLineAnimate : "";

  return (
    <span
      id={"waving-hand"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={() => {
        onMouseEnter();
        setTimeout(() => {
          onMouseLeave();
        }, 2800);
      }}
      className={`${styles.HeyLineHand} ${animationStyle}`}
    >
      👋
    </span>
  );
}
