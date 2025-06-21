import { motion, type Variants } from 'framer-motion';
import React, { useState } from 'react';
import FileCard from './FileCard';
import styles from './index.module.scss';

interface FileItem {
  id: number;
  name: string;
  content: string;
  date: string;
}

const FileIdea: React.FC = () => {
  // 模拟文件数据（你的30个日志文件）
  const files: FileItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `日志_${String(i + 1).padStart(2, '0')}.md`,
    content: `这是第${i + 1}天的日志内容。今天学习了很多新知识，记录了一些重要的想法和进展。包含了关于技术学习、项目进展、个人思考和日常记录等多个方面的详细内容。记录了学习进度、遇到的问题、解决方案以及个人的思考和总结。`,
    date: `2024-01-${String(i + 1).padStart(2, '0')}`,
  }));

  const [activeFileId, setActiveFileId] = useState<number>(files[0].id);
  const activeFile = files.find(file => file.id === activeFileId) || files[0];

  return (
    <div className={styles.fileIdeaScrollContainer}>
      {/* 左侧滚动文件列表 */}
      <div className={styles.filesScrollArea}>
        <div className={styles.scrollHeader}>
          <h2>文件管理</h2>
          <div className={styles.fileCount}>
            共
            {files.length}
            {' '}
            个文件
          </div>
        </div>

        <div className={styles.filesScrollWrapper}>
          {files.map((file, i) => (
            <FileCard
              key={file.id}
              file={file}
              index={i}
              onInView={() => setActiveFileId(file.id)}
            />
          ))}
        </div>
      </div>

      {/* 右侧内容详情 */}
      <div className={styles.contentDetailArea}>
        <motion.div
          className={styles.contentDetail}
          key={activeFile.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className={styles.detailHeader}>
            <h2>{activeFile.name}</h2>
            <span className={styles.detailDate}>{activeFile.date}</span>
          </div>
          <div className={styles.detailContent}>
            <p>{activeFile.content}</p>
            <div className={styles.detailStats}>
              <span>
                文件 #
                {activeFile.id}
              </span>
              <span>
                共
                {files.length}
                {' '}
                个文件
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FileIdea;
