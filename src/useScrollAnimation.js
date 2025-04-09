import { useEffect, useRef } from 'react';

function useScrollAnimation(
    targetSelector,
    visibleClass = 'is-visible',
    options = { threshold: 0.1, triggerOnce: true }
) {
    const observerRef = useRef(null);

    useEffect(() => {
        const intersectionCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(visibleClass);
                    if (options.triggerOnce) {
                        observer.unobserve(entry.target);
                    }
                } else {
                    if (!options.triggerOnce) {
                        entry.target.classList.remove(visibleClass);
                    }
                }
            });
        };

        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(intersectionCallback, {
                threshold: options.threshold,
                rootMargin: options.rootMargin || '0px',
            });
        }
        const observer = observerRef.current;

        const targets = document.querySelectorAll(targetSelector);
        targets.forEach(target => {
            const alreadyVisible = observer.takeRecords().some(entry => entry.target === target && entry.isIntersecting);
            if (alreadyVisible) {
                target.classList.add(visibleClass);
                if (!options.triggerOnce) {
                    observer.observe(target);
                }
            } else {
                observer.observe(target);
            }
        });

        return () => {
            if (observer) {
                targets.forEach(target => observer.unobserve(target));
            }
        };
    }, [targetSelector, visibleClass, options]);
}

export default useScrollAnimation;