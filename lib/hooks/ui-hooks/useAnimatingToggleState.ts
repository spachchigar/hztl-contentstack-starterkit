import { RefObject, SetStateAction, useCallback, useEffect, useState } from 'react';

/**
 * `useState` alternative for toggling an element visibility with animation.  Returns separate values for opening vs visible.
 * `isVisible` is set to true right away when opening, but only set to false after animation complete.
 * @param animationElement The element that will be animating
 * @param initialVisibleState Initial open state
 * @returns `[isOpening, setIsOpening, isVisible]`, `isOpening` is for the animation. `isVisible` is for showing/hiding the element.
 */
export function useAnimatingToggleState(
  animationElement: RefObject<HTMLElement | null>,
  initialVisibleState = false
) {
  const [isOpening, setIsOpeningInternal] = useState(initialVisibleState);
  const [isVisible, setIsVisible] = useState(initialVisibleState);

  useEffect(() => {
    if (!animationElement.current) {
      return;
    }
    if (!isOpening) {
      // When closing we want to wait until animation is complete before hiding element
      try {
        const animations = animationElement.current.getAnimations();
        if (animations.length > 0) {
          Promise.all(animations.map((anim) => anim.finished)).then(() => {
            setIsVisible(false);
          });
        } else {
          // Fallback: if no animations detected, hide immediately after a short delay
          setTimeout(() => setIsVisible(false), 300);
        }
      } catch (error) {
        console.error('Error getting animations:', error);
        // Fallback for browsers/environments that don't support getAnimations
        setTimeout(() => setIsVisible(false), 300);
      }
    }
  }, [isOpening, animationElement]);

  const setIsOpening = useCallback(
    (value: SetStateAction<boolean>) => {
      // This can be either the actual value, or a function to get the actual value
      const isRealValue = value === true || value === false;
      const realValue = isRealValue ? value : value(isOpening);
      // Set visible to true first
      if (realValue) {
        setIsVisible(true);
      }
      // Use requestAnimationFrame with double RAF for better reliability in production
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsOpeningInternal(value);
        });
      });
    },
    [isOpening]
  );

  return [isOpening, setIsOpening, isVisible] as const;
}
