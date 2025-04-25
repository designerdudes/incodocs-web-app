'use client';

import { useEffect, useRef } from 'react';
import { inspiraImageParticles } from './inspiraimageparticle'; // Adjust path as needed

const ParticleImage = ({
  imageSrc,
  className = '',
  canvasWidth = '300',
  canvasHeight = '300',
  gravity = '0.08',
  particleSize = '1',
  particleGap = '3',
  mouseForce = '30',
  renderer = 'webgl',
  color = "#sfewt",
  colorArr,
  initPosition = 'random',
  initDirection = 'random',
  fadePosition = 'none',
  fadeDirection = 'none',
  noise = 10,
  responsiveWidth = false,
}) => {
  const imageRef = useRef(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const { InspiraImageParticle } = inspiraImageParticles();
    const particles = new InspiraImageParticle(imageRef.current);

    return () => {
      particles.stop();
    };
  }, []);

  return (
    <img
      ref={imageRef}
      src={imageSrc}
      className={`hidden w-32 h-32 ${className}`}
      data-particle-gap={particleGap}
      data-width={canvasWidth}
      data-height={canvasHeight}
      data-gravity={gravity}
      data-particle-size={particleSize}
      data-mouse-force={mouseForce}
      data-renderer={renderer}
      data-color={color}
      data-color-arr={colorArr}
      data-init-position={initPosition}
      data-init-direction={initDirection}
      data-fade-position={fadePosition}
      data-fade-direction={fadeDirection}
      data-noise={noise}
      data-responsive-width={responsiveWidth}
      alt="Particle Image"
    />
  );
};

export default ParticleImage;