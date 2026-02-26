import { useEffect, useRef } from 'react';

/**
 * Custom hook for 3D mouse-tracking tilt effect
 * Adds realistic 3D perspective based on mouse position
 */
export function use3DTilt(intensity = 15) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateY = (mouseX / (rect.width / 2)) * intensity;
      const rotateX = -(mouseY / (rect.height / 2)) * intensity;
      
      element.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateZ(20px)
        scale3d(1.02, 1.02, 1.02)
      `;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return elementRef;
}

/**
 * HOC Component that wraps children with 3D tilt effect
 */
export function Card3D({ children, intensity = 15, className = '' }) {
  const cardRef = use3DTilt(intensity);

  return (
    <div 
      ref={cardRef} 
      className={`card-3d ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}

export default use3DTilt;
