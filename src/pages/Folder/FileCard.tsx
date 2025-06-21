import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import styles from './index.module.scss';

interface FileItem {
  id: number;
  name: string;
  content: string;
  date: string;
}

interface FileCardProps {
  file: FileItem;
  index: number;
  onInView: () => void;
}

function FileCard({ file, index, onInView }: FileCardProps) {
  // 为每个文件生成不同的颜色
  const hueA = (index * 360 / 30) % 360;
  const hueB = ((index * 360 / 30) + 40) % 360;
  const background = `linear-gradient(306deg, hsl(${hueA}, 70%, 50%), hsl(${hueB}, 70%, 50%))`;

  const cardVariants: Variants = {
    offscreen: {
      y: 330,
    },
    onscreen: {
      y: 50,
      rotate: -10,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.div
      className={styles.fileCardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
      onViewportEnter={onInView}
    >
      {/* 背景装饰 */}
      <div className={styles.fileCardSplash} style={{ background }} />

      {/* 文件卡片 */}
      <motion.div
        className={styles.fileCard}
        variants={cardVariants}
      >
        <div className={styles.fileIcon}>📄</div>
        <div className={styles.fileInfo}>
          <div className={styles.fileName}>{file.name}</div>
          <div className={styles.fileDate}>{file.date}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
export default FileCard;
