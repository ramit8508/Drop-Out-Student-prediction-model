import { useEffect } from 'react';

/**
 * Simplified mouse parallax effect for 3D depth
 * Optimized with throttling to prevent lag
 */
export function useMouseParallax() {
  useEffect(() => {
    let ticking = false;
    let lastX = 0;
    let lastY = 0;

    const updatePositions = () => {
      const moveX = lastX;
      const moveY = lastY;
      
      // Apply subtle parallax only to header
      const headerElement = document.querySelector('.app-header');
      
      if (headerElement) {
        headerElement.style.transform = `translateX(${moveX * 5}px) translateY(${moveY * 3}px)`;
      }
      
      ticking = false;
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      lastX = (clientX - centerX) / centerX;
      lastY = (clientY - centerY) / centerY;
      
      // Throttle updates using requestAnimationFrame
      if (!ticking) {
        window.requestAnimationFrame(updatePositions);
        ticking = true;
      }
    };
    
    const handleMouseLeave = () => {
      const headerElement = document.querySelector('.app-header');
      
      if (headerElement) {
        headerElement.style.transform = 'translateX(0px) translateY(0px)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
}

export default useMouseParallax;
