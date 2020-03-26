import React from 'react';
import { Card } from 'antd';
import marked from 'marked'
import highlight from "highlight.js";
import 'highlight.js/styles/github.css';
import styles from './index.less';

interface ArticleProps {
  loading: boolean;
  data: {
    title: string;
    author: string;
    date: string;
    content: string;
  };
};

const Article: React.FC<ArticleProps> = props => {
  const { data: { title, date, content, author }, loading } = props;
  const dateTime = new Date(date).toLocaleDateString();
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: (code: string) => {
      return highlight.highlightAuto(code).value;
    },
  });
  const htmlContent = marked(content);
  return (
    <Card loading={loading}>
      <article>
        <header>
          <h1
            style={{
              fontSize: '26px',
              textAlign: 'center',
              wordBreak: 'break-word',
              fontWeight: 400,
            }}
          >
            {title}
          </h1>
          <div
            style={{
              margin: '3px 0 60px 0',
              color: '#999',
              fontFamily: '"Lato", "PingFang SC", "Microsoft YaHei", sans-serif',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            <span>{author} 发表于 <time>{dateTime}</time> </span>
          </div>
        </header>
        <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
      </article>
    </Card>
  )
};

export default Article;