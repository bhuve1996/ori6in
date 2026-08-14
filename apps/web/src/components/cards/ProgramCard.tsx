'use client';

import { cn } from '@ori6in/ui';
import {
  Card,
  CardBody,
  CardFooter,
  CardMedia,
  CardTitle,
  TileCta,
  TileSub,
} from '@ori6in/ui';
import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import type { Program } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import { programImage } from '../../lib/media';
import { easeOut, softSpring } from '../../lib/motion';

type Props = {
  program: Program;
  /** `mkt` = programs index; `home` = homepage strip */
  surface?: 'mkt' | 'home';
  cta?: string;
  summaryLines?: 2 | 3;
  titleAs?: 'h2' | 'h3';
  className?: string;
  style?: CSSProperties;
  index?: number;
};

export function ProgramCard({
  program,
  surface = 'mkt',
  cta = 'View program',
  summaryLines = 3,
  titleAs = 'h2',
  className,
  style,
  index = 0,
}: Props) {
  const root = surface === 'home' ? 'home-program-card' : 'mkt-program-card';

  return (
    <motion.div
      className={cn('h-full', className)}
      style={style}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: easeOut, delay: index * 0.06 }}
      whileHover={{ y: -4, transition: softSpring }}
    >
      <Card href={`/programs/${program.slug}`} className={cn(root, 'h-full')}>
        <CardMedia className={`${root}__media`}>
          <motion.img
            src={programImage(program.slug)}
            alt=""
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: easeOut }}
          />
        </CardMedia>
        <CardBody className={`${root}__body`}>
          <CardTitle as={titleAs}>{program.title}</CardTitle>
          <TileSub lines={summaryLines}>{program.summary}</TileSub>
          <CardFooter className={`${root}__foot`}>
            <span className="price-tag price">{formatPrice(program.priceCents, program.currency)}</span>
            <TileCta>{cta}</TileCta>
          </CardFooter>
        </CardBody>
      </Card>
    </motion.div>
  );
}
