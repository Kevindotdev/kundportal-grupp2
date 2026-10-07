'use client';

import { useEffect } from 'react';

export default function ButtonClickFeedback() {
  useEffect(() => {
    let clickedButton: HTMLButtonElement | null = null;

    function markClickedButton(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest('button');
      if (!(button instanceof HTMLButtonElement) || button.disabled) return;

      clickedButton?.removeAttribute('data-clicked');
      button.setAttribute('data-clicked', 'true');
      clickedButton = button;
    }

    document.addEventListener('click', markClickedButton, true);
    return () => document.removeEventListener('click', markClickedButton, true);
  }, []);

  return null;
}