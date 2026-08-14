'use client';

import { Card, TileCta, cn } from '@ori6in/ui';
import { motion } from 'motion/react';
import { Avatar } from '../Avatar';
import { easeOut, softSpring } from '../../lib/motion';

export type MentorCardData = {
  id: string;
  fullName: string;
  title: string;
  bio?: string;
  skills?: string[];
  location?: string;
};

type Props = {
  mentor: MentorCardData;
  className?: string;
  index?: number;
};

export function MentorCard({ mentor, className, index = 0 }: Props) {
  const skills = mentor.skills?.slice(0, 3) ?? [];

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: easeOut, delay: index * 0.06 }}
      whileHover={{ y: -4, transition: softSpring }}
    >
      <Card href={`/mentors/${mentor.id}`} className={cn('mkt-mentor-card', className)}>
        <Avatar name={mentor.fullName} seed={mentor.fullName} kind="mentor" size="lg" decorative />
        <h2>{mentor.fullName}</h2>
        <p className="mkt-mentor-card__role">{mentor.title}</p>
        {mentor.location ? <p className="mkt-mentor-card__loc">{mentor.location}</p> : null}
        {skills.length > 0 ? (
          <ul className="mkt-mentor-card__skills">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        ) : null}
        {mentor.bio ? <p className="mkt-mentor-card__bio">{mentor.bio}</p> : null}
        <TileCta className="mkt-mentor-card__cta">View profile</TileCta>
      </Card>
    </motion.div>
  );
}
