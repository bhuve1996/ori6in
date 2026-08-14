'use client';

import {
  Card,
  CardBody,
  CardMedia,
  CardTitle,
  TileCta,
  TileMeta,
  TileSub,
  cn,
} from '@ori6in/ui';
import { motion } from 'motion/react';
import type { BlogPost } from '../../lib/api';
import { BANNERS } from '../../lib/media';
import { easeOut, softSpring } from '../../lib/motion';

type Props = {
  post: BlogPost;
  index?: number;
  className?: string;
};

export function BlogCard({ post, index = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: easeOut, delay: index * 0.05 }}
      whileHover={{ y: -3, transition: softSpring }}
    >
      <Card href={`/blog/${post.slug}`} className={cn('mkt-blog-card', className)}>
        <CardMedia className="mkt-blog-card__media">
          <motion.img
            src={BANNERS.blog}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            style={{ objectPosition: `${20 + ((index * 17) % 60)}% center` }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: easeOut }}
          />
        </CardMedia>
        <CardBody className="mkt-blog-card__body">
          <TileMeta>Article</TileMeta>
          <CardTitle>{post.title}</CardTitle>
          <TileSub lines={2}>{post.excerpt}</TileSub>
          <TileCta>Read more</TileCta>
        </CardBody>
      </Card>
    </motion.div>
  );
}
