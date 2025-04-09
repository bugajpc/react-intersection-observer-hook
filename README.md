# React Custom Hook: useScrollAnimation

A performant and flexible React custom hook to trigger animations on elements when they scroll into the viewport, using the native Intersection Observer API.

This hook allows you to easily add "slide-in," "fade-in," or any other CSS-based animation to specific elements on your page without relying on scroll event listeners or external libraries.

## Features

*   **Performant:** Uses the efficient Intersection Observer API, avoiding the performance pitfalls of scroll event listeners.
*   **Flexible:** Target any elements using CSS selectors.
*   **Customizable:** Control animation timing (`threshold`), repetition (`triggerOnce`), viewport margins (`rootMargin`), and the CSS class used to trigger the animation.
*   **Simple Integration:** Easy to add to any React functional component.
*   **No Dependencies:** Uses native browser APIs.

## Installation / Setup

1.  **Copy the Hook:** Copy the `useScrollAnimation.js` file into your React project, typically within a `src/hooks/` directory.

    ```javascript
    // src/hooks/useScrollAnimation.js
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
                    // Consider observer.disconnect() if the observer is truly scoped only to this hook instance
                }
            };
        }, [targetSelector, visibleClass, options]); // Ensure options object reference is stable if passed directly
                                                     // or memoize it in the parent component.
                                                     // For simplicity, this basic setup assumes options object doesn't change frequently.
    }

    export default useScrollAnimation;
    ```

2.  **Create CSS Animations:** Define the CSS rules for your animations. You need:
    *   A base style for the elements *before* they are visible (e.g., `opacity: 0`, `transform: translateY(50px)`).
    *   A style for when the `visibleClass` is added (e.g., `opacity: 1`, `transform: translateY(0)`).
    *   A `transition` property on the base style to make the change smooth.

## Usage

1.  **Import the Hook** into your component file:

    ```javascript
    import useScrollAnimation from './hooks/useScrollAnimation'; // Adjust path if needed
    ```

2.  **Call the Hook** within your functional component, providing the CSS selector for the elements you want to animate:

    ```javascript
    function MyComponent() {
        // Basic usage: Animate elements with class '.animate-me'
        // When visible, the class 'is-visible' will be added.
        useScrollAnimation('.animate-me');

        // Advanced usage: Animate elements with ID '#special-item'
        // Use a different visibility class 'activated'
        // Trigger when 50% visible, and animate every time it enters/leaves view
        useScrollAnimation('#special-item', 'activated', {
             threshold: 0.5,
             triggerOnce: false
        });

        // ... rest of your component logic
        return (
            <div>
                {/* Add the target class/ID to elements */}
                <h1 className="animate-me">This will animate</h1>
                <p>This won't</p>
                <div id="special-item">This uses different options</div>
                <p className="animate-me">This will also animate</p>
            </div>
        );
    }
    ```

## API Reference

`useScrollAnimation(targetSelector, visibleClass, options)`

*   **`targetSelector`** (String - **Required**)
    *   A CSS selector string used to identify the target elements to observe.
    *   Examples: `.my-class`, `#my-id`, `[data-animate]`, `section > p`

*   **`visibleClass`** (String - Optional)
    *   The CSS class name to add to the target element when it becomes visible according to the options.
    *   Defaults to: `'is-visible'`

*   **`options`** (Object - Optional)
    *   An object to configure the Intersection Observer behavior.
    *   **`threshold`** (Number | Number[] - Optional)
        *   Determines at what percentage of the target's visibility the observer's callback should be executed.
        *   `0`: As soon as one pixel is visible.
        *   `0.5`: When 50% of the element is visible.
        *   `1`: When the entire element is visible.
        *   Can also be an array of thresholds, e.g., `[0, 0.25, 0.5, 0.75, 1]`.
        *   Defaults to: `0.1` (10% visible)
    *   **`triggerOnce`** (Boolean - Optional)
        *   If `true`, the `visibleClass` is added only the first time the element becomes visible, and the observer stops watching it afterward.
        *   If `false`, the `visibleClass` will be added when the element enters the viewport and removed when it leaves (requires appropriate CSS and hook logic to handle removal, which the provided basic hook does if `triggerOnce` is false).
        *   Defaults to: `true`
    *   **`rootMargin`** (String - Optional)
        *   Margin around the root viewport. Works like the CSS `margin` property (e.g., `'10px 20px 30px 40px'`). It can grow or shrink the area used for intersection checking. Useful for triggering animations slightly before or after an element strictly enters the viewport.
        *   Defaults to: `'0px'`

## CSS Setup Example

You need corresponding CSS to define the animation states.

```css
/* Define styles for elements targeted by the hook */

/* Example 1: Simple Fade-in */
.fade-in-element {
  opacity: 0;
  transition: opacity 1s ease-in-out;
  will-change: opacity; /* Performance hint */
}

.fade-in-element.is-visible { /* Matches default visibleClass */
  opacity: 1;
}


/* Example 2: Slide-up */
.slide-up-element {
  opacity: 0;
  transform: translateY(40px); /* Start 40px down */
  transition: opacity 0.6s ease-out, transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
  will-change: opacity, transform; /* Performance hint */
}

.slide-up-element.is-visible {
  opacity: 1;
  transform: translateY(0); /* End at original position */
}

/* Example 3: Using a custom visibleClass 'activated' */
.slide-left-custom {
    opacity: 0;
    transform: translateX(-100px);
    transition: opacity 0.5s ease-out, transform 0.7s ease-out;
    will-change: opacity, transform;
}

.slide-left-custom.activated { /* Use the custom class specified in the hook */
     opacity: 1;
    transform: translateX(0);
}
