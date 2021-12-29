import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';


import styles from './home.module.scss';

import { Post } from '../components/Post';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(
    postsPagination.next_page
  );

  const getNextPage = async () => {
    await fetch(nextPageUrl)
      .then(response => response.json())
      .then(response => {
        setNextPageUrl(response.next_page);
        setPosts(posts.concat(response.results));
      });
  };

  return (
    <div className={styles.postsContent}>
      <div className={styles.posts}>
        {posts.map((post, index) => (
          <Post
            key={index}
            slug={post.uid}
            author={post.data.author}
            title={post.data.title}
            date={format(new Date(post.first_publication_date), 'd MMM u', {
              locale: pt,
            })}
            subtitle={post.data.subtitle}
          />
        ))}
      </div>
      {nextPageUrl && (
        <button onClick={getNextPage} className={styles.loadMorePosts}>
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query('');

  return {
    props: {
      postsPagination: response,
    },
    revalidate: 60 * 60,
  };
};
