'use client';

import { cn } from '@lib/utils';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface IconButtonProps {
  content?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
  Icon?: (props: TIconProps) => ReactNode;
}

export const IconButton = ({ className, content, href = '/', Icon, onClick }: IconButtonProps) => {
  const withHref = !onClick;

  const animationProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.2, stiffness: 130, damping: 10 },
  };

  const commonClasses = cn(
    'group relative flex cursor-pointer bg-foreground text-secondary items-center justify-center p-5 overflow-hidden rounded-full font-medium',
    className,
  );

  const commonContent = (
    <>
      <span
        className={cn(
          'via-secondary-light absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent opacity-10 transition-transform duration-1000 group-hover:translate-x-full',
        )}
      />

      <div className='relative z-10 flex items-center gap-3'>
        {Icon && <Icon />}
        {content && <strong>{content}</strong>}
      </div>
    </>
  );

  return withHref ? (
    <motion.a href={href} {...animationProps} className={commonClasses}>
      {commonContent}
    </motion.a>
  ) : (
    <motion.button type='button' {...animationProps} className={commonClasses} onClick={onClick}>
      {commonContent}
    </motion.button>
  );
};
