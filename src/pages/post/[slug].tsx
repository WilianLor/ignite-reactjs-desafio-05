import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import commonStyles from '../../styles/common.module.scss';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <div className={styles.postContainer}>
      <img src={post.data.banner.url} className={styles.banner} />
      <article>
        <div className={styles.headerContent}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.infos}>
            <span>
              <FiCalendar />
              <h4>
                {format(new Date(post.first_publication_date), 'd MMM u', {
                  locale: pt,
                })}
              </h4>
            </span>
            <span>
              <FiUser />
              <h4>{post.data.author}</h4>
            </span>
            <span>
              <FiClock />
              <h4>
                {Math.ceil(
                  post.data.content.reduce((words, content) => {
                    const bodyWords = RichText.asText(content.body).split(
                      ' '
                    ).length;

                    return words + bodyWords;
                  }, 0) / 200
                )}{' '}
                min
              </h4>
            </span>
          </div>
        </div>
        {post.data.content.map((content, index) => (
          <div key={index} className={styles.postContent}>
            <h2>{content.heading}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
            />
          </div>
        ))}
      </article>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query('');

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post: response,
    },
    revalidate: 60 * 60 * 24,
  };
};
