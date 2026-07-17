import PersonInfo from "@/components/People/PersonInfo";
import ArticleLinks from "./ArticleLinks";

import styles from "./ContributorsPage.module.css";

const Contributor = ({ contributor, index }) => {
  const lastName = contributor.name.trim().split(" ").slice(-1)[0];
  const initial = lastName.charAt(0).toUpperCase();

  return (
    <div className={`contributor-${initial} ${styles.contributor_wrapper}`} data-contributor-initial={initial} key={index}>
      <PersonInfo className={styles.contributor_info} person={contributor} classNameCell={styles.cell} hideTitle={true} />
      <ArticleLinks contributor={contributor} index={index} />
    </div>
  );
};

export default Contributor;
