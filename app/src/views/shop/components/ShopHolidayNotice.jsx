import TextCarousel from "@/components/Carousel/TextCarousel";
import { translate } from "@/helpers/translate";

import styles from "./ShopHolidayNotice.module.css";

const SHOP_HOLIDAY_NOTICE = "We are currently on holiday! Orders will be processed on the 12th of September";

const ShopHolidayNotice = ({ show = true, text }) => {
  if (!show) return null;

  const noticeText = translate(text) || SHOP_HOLIDAY_NOTICE;

  return (
    <div className={styles.notice} typo="h3">
      <TextCarousel text={noticeText} className={styles.marquee} />
    </div>
  );
};

export default ShopHolidayNotice;
