import { useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };

  const items = [
    {
      page: "Бар",
      backgroundImage: "/bottles.jpg",
      navigator: "/bar",
    },
    {
      page: "Журнал",
      backgroundImage: "/coctail_bar.jpg",
      navigator: "/journal",
    },
  ];

  return (
    <div className={styles.slider}>
      <div className={styles.options}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.option} ${
              index === activeIndex ? styles.active : ""
            }`}
            onClick={() =>
              activeIndex === index
                ? navigate(`${item.navigator}`)
                : handleItemClick(index)
            }
            style={{
              width: index === activeIndex ? "600px" : "80px",
              backgroundImage: `url(${item.backgroundImage})`,
            }}
          >
            <div className={styles.shadow}></div>
            <div className={styles.label}>
              <div className={styles.info}>
                <div className={styles.page}>{item.page}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
