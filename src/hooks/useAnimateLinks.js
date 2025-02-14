import { useEffect } from 'react';

export const useAnimateLinks = () => {
  useEffect(() => {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.classList.add('animate-link');
      setTimeout(() => link.classList.add('animate'), 50);
    });
  }, []);
};
