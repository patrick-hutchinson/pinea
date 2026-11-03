import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/Buttons/Button";
import styles from "./ProfilePage.module.css";

const ProfileSubmitAction = ({ needsImageRights, onConfirmImageRights, disabled, submitting }) => (
  <div className={styles.submitAction}>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={needsImageRights ? "image-rights" : "submit"}
        className={styles.submitActionState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, pointerEvents: "none" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {needsImageRights ? (
          <label className={styles.imageRightsConfirmation} typo="h5">
            <input type="checkbox" defaultChecked={false} onChange={(event) => event.target.checked && onConfirmImageRights()} />
            <span>I confirm that I have the necessary rights to share the uploaded image</span>
          </label>
        ) : (
          <Button
            className={`${styles.sendButton} ${disabled ? styles.sendButtonDisabled : ""}`}
            disabled={disabled}
            type="submit"
            form="profile-suggest-form"
          >
            {submitting ? "SUBMITTING" : "SUBMIT"}
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  </div>
);

export default ProfileSubmitAction;
