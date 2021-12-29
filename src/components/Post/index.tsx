import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import { FiCalendar } from 'react-icons/fi';

import styles from './post.module.scss';
import commonStyles from '../../styles/common.module.scss';

interface PostProps {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
}

export const Post = ({ slug, title, subtitle, date, author }: PostProps) => {
  return (
    <Link href={`/post/${slug}`}>
      <div className={styles.postContainer}>
        <h1>{title}</h1>
        <h3>{subtitle}</h3>
        <div className={commonStyles.infos}>
          <span>
            <FiCalendar />
            <h4>{date}</h4>
          </span>
          <span>
            <FiUser />
            <h4>{author}</h4>
          </span>
        </div>
      </div>
    </Link>
  );
};
