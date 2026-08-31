import { useEffect, useRef, useState } from "react";

export default function useScrollAnimation(options = {}) {
  const {
    threshold = 0.2,   // % do elemento visível para disparar
    once = true,       // anima só uma vez, ou toda vez que entra/sai
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, isVisible];
}