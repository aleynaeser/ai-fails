'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { AddFailForm } from '@components/shared/AddFailForm';

interface IAddFailModalProps {
  open: boolean;
  categories: IFailCategory[];
  onClose: () => void;
}

export function AddFailModal({ open, categories, onClose }: IAddFailModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [open]);

  return <AnimatePresence mode='wait'>{open && <AddFailForm open={open} categories={categories} onClose={onClose} />}</AnimatePresence>;
}
