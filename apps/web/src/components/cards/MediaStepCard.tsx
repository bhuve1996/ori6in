'use client';

import { Card, CardBody, CardMedia, CardTitle, TileMeta, TileSub, cn } from '@ori6in/ui';
import { motion } from 'motion/react';
import { easeOut } from '../../lib/motion';

type Props = {
  image: string;
  meta: string;
  title: string;
  caption: string;
  eager?: boolean;
  className?: string;
  index?: number;
};

/** Non-link pictorial step/tile used on how-it-works and similar. */
export function MediaStepCard({
  image,
  meta,
  title,
  caption,
  eager,
  className,
  index = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: easeOut, delay: index * 0.08 }}
    >
      <Card as="figure" className={cn('mkt-program-card', className)}>
        <CardMedia className="mkt-program-card__media">
          <img src={image} alt="" loading={eager ? 'eager' : 'lazy'} />
        </CardMedia>
        <CardBody className="mkt-program-card__body">
          <TileMeta>{meta}</TileMeta>
          <CardTitle>{title}</CardTitle>
          <TileSub lines={3}>{caption}</TileSub>
        </CardBody>
      </Card>
    </motion.div>
  );
}
