import { useEffect, useRef } from "react";

/**
 * Enhanced hero starfield with neural structure exclusion and balanced distribution:
 *  - Evenly distributed stars across viewport with neural structure exclusion
 *  - Denser center and balanced edges
 *  - Smooth local oscillation for each star (small to-and-fro motion)
 *  - Noticeable blinking effect
 */
const HeroStarfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let tick = 0;

    // Neural structure parameters
    const neuralCenterOffsetX = 0.65; // position neural structure more to the right
    const neuralExclusionRadius = 280; // focused exclusion only around neural structure

    type Star = { 
      x: number;
      originalX: number; // original position for oscillation
      y: number;
      originalY: number; // original position for oscillation
      r: number; 
      baseAlpha: number;
      blinkPhase: number;
      oscillationPhaseX: number;
      oscillationPhaseY: number;
      oscillationRangeX: number;
      oscillationRangeY: number;
      isLabelStar?: boolean; // marks stars at yellow labeled positions
    };
    let stars: Star[] = [];
    let neuralCenter = { x: 0, y: 0 };

    // Yellow labeled positions (normalized coordinates)
    // Outer/peripheral positions
    const labeledPositions = [
      { x: 0.52, y: 0.12 },
      { x: 0.65, y: 0.08 },
      { x: 0.75, y: 0.10 },
      { x: 0.82, y: 0.18 },
      { x: 0.88, y: 0.12 },
      { x: 0.62, y: 0.25 },
      { x: 0.72, y: 0.28 },
      { x: 0.82, y: 0.32 },
      { x: 0.85, y: 0.45 },
      { x: 0.75, y: 0.55 },
      { x: 0.65, y: 0.68 },
      { x: 0.75, y: 0.78 },
    ];

    // Interior labeled positions (inside neural structure - blue outlined area)
    const interiorLabeledPositions = [
      // Upper interior area - select positions only
      { x: 0.62, y: 0.15 },
      { x: 0.65, y: 0.20 },
      // Upper-middle area
      { x: 0.60, y: 0.32 },
      { x: 0.70, y: 0.35 },
      // Center area (core of neural structure)
      { x: 0.65, y: 0.48 },
      { x: 0.68, y: 0.50 },
      // Lower-middle area
      { x: 0.58, y: 0.62 },
      { x: 0.68, y: 0.60 },
      // Lower interior area
      { x: 0.65, y: 0.75 },
      { x: 0.72, y: 0.72 },
      // Additional strategically placed interior stars
      { x: 0.52, y: 0.55 },
      { x: 0.75, y: 0.55 },
    ];

    const computeNeuralCenter = () => {
      neuralCenter.x = w * neuralCenterOffsetX;
      neuralCenter.y = h * 0.5;
    };

    const isInsideNeuralStructure = (x: number, y: number): boolean => {
      const dx = x - neuralCenter.x;
      const dy = y - neuralCenter.y;
      const distSquared = dx * dx + dy * dy;
      return distSquared < neuralExclusionRadius * neuralExclusionRadius;
    };

    const getStarDensity = (x: number, y: number): number => {
      const normalizedX = x / w;
      const normalizedY = y / h;
      
      // Base density from center falloff
      const distFromCenterX = Math.abs(normalizedX - 0.5);
      const distFromCenterY = Math.abs(normalizedY - 0.5);
      
      let baseDensity = Math.exp(-(distFromCenterX * distFromCenterX) * 2.5) * 
                        Math.exp(-(distFromCenterY * distFromCenterY) * 2.5);
      
      // REDUCE density in red labeled areas
      
      // Top area (red) - significantly reduce
      if (normalizedY < 0.2) {
        baseDensity *= 0.3;
      }
      
      // Top-right corner (red) - significantly reduce
      if (normalizedX > 0.8 && normalizedY < 0.25) {
        baseDensity *= 0.2;
      }
      
      // Bottom-left area (red) - significantly reduce
      if (normalizedX < 0.35 && normalizedY > 0.75) {
        baseDensity *= 0.25;
      }
      
      // INCREASE density in yellow labeled areas (around neural structure)
      
      // Left and bottom sides of neural structure (yellow region)
      const neuralCenterX = 0.65;
      const neuralCenterY = 0.5;
      const distToNeural = Math.sqrt(
        (normalizedX - neuralCenterX) * (normalizedX - neuralCenterX) * 0.6 +
        (normalizedY - neuralCenterY) * (normalizedY - neuralCenterY) * 0.6
      );
      
      // Add density boost in the yellow regions around neural structure
      if (distToNeural > 0.25 && distToNeural < 0.5) {
        baseDensity += 0.4 * Math.exp(-(Math.pow(distToNeural - 0.35, 2)) * 6);
      }
      
      // Additional boost for left side of neural structure (yellow)
      if (normalizedX < 0.5 && normalizedY > 0.25 && normalizedY < 0.75) {
        baseDensity += 0.25;
      }
      
      return Math.min(baseDensity, 1.0);
    };

    const shouldPlaceStar = (x: number, y: number): boolean => {
      if (isInsideNeuralStructure(x, y)) {
        return false;
      }
      
      // Use density-based probabilistic placement
      const density = getStarDensity(x, y);
      return Math.random() < density * 0.8; // 0.8 is probability multiplier
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      computeNeuralCenter();

      stars = [];
      
      // Grid-based placement with density variation
      const cellSize = 35; // smaller cell size for better placement
      const totalCells = Math.ceil((w * h) / (cellSize * cellSize));
      const targetStars = Math.floor(totalCells * 0.2); // reduced from 0.35 to lower overall density
      
      let attempts = 0;
      const maxAttempts = targetStars * 4;
      
      while (stars.length < targetStars && attempts < maxAttempts) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        
        if (shouldPlaceStar(x, y)) {
          const r = 0.4 + Math.random() * 0.7;
          stars.push({
            x,
            originalX: x,
            y,
            originalY: y,
            r,
            baseAlpha: 0.25 + Math.random() * 0.45,
            blinkPhase: Math.random() * Math.PI * 2,
            oscillationPhaseX: Math.random() * Math.PI * 2,
            oscillationPhaseY: Math.random() * Math.PI * 2,
            oscillationRangeX: (2 + Math.random() * 4) * r, // small oscillation range based on size
            oscillationRangeY: (2 + Math.random() * 4) * r,
          });
        }
        attempts++;
      }

      // Add stars at labeled positions with brighter appearance
      for (const pos of labeledPositions) {
        const x = pos.x * w;
        const y = pos.y * h;
        const r = 1.2 + Math.random() * 0.8; // Larger stars for labeled positions
        stars.push({
          x,
          originalX: x,
          y,
          originalY: y,
          r,
          baseAlpha: 0.6 + Math.random() * 0.4, // Brighter
          blinkPhase: Math.random() * Math.PI * 2,
          oscillationPhaseX: Math.random() * Math.PI * 2,
          oscillationPhaseY: Math.random() * Math.PI * 2,
          oscillationRangeX: (1 + Math.random() * 2) * r,
          oscillationRangeY: (1 + Math.random() * 2) * r,
          isLabelStar: true,
        });
      }

      // Add stars at INTERIOR labeled positions (inside neural structure)
      for (const pos of interiorLabeledPositions) {
        const x = pos.x * w;
        const y = pos.y * h;
        const r = 0.6 + Math.random() * 0.4; // Smaller interior stars
        stars.push({
          x,
          originalX: x,
          y,
          originalY: y,
          r,
          baseAlpha: 0.5 + Math.random() * 0.5, // Bright but with variety
          blinkPhase: Math.random() * Math.PI * 2,
          oscillationPhaseX: Math.random() * Math.PI * 2,
          oscillationPhaseY: Math.random() * Math.PI * 2,
          oscillationRangeX: (1.5 + Math.random() * 3) * r,
          oscillationRangeY: (1.5 + Math.random() * 3) * r,
          isLabelStar: true,
        });
      }

      // Generate additional random stars INSIDE the neural structure for comprehensive coverage
      const interiorStarCount = 5; // Reduced from 15 for lower density in center
      let interiorAttempts = 0;
      const maxInteriorAttempts = interiorStarCount * 5;

      while (stars.length < targetStars + labeledPositions.length + interiorLabeledPositions.length + interiorStarCount && interiorAttempts < maxInteriorAttempts) {
        const x = Math.random() * w;
        const y = Math.random() * h;

        // Only place if INSIDE neural structure
        if (isInsideNeuralStructure(x, y)) {
          const r = 0.25 + Math.random() * 0.35;
          stars.push({
            x,
            originalX: x,
            y,
            originalY: y,
            r,
            baseAlpha: 0.35 + Math.random() * 0.45,
            blinkPhase: Math.random() * Math.PI * 2,
            oscillationPhaseX: Math.random() * Math.PI * 2,
            oscillationPhaseY: Math.random() * Math.PI * 2,
            oscillationRangeX: (1.5 + Math.random() * 3) * r,
            oscillationRangeY: (1.5 + Math.random() * 3) * r,
          });
        }
        interiorAttempts++;
      }
    };

    const getBlink = (star: Star): number => {
      // Increased blink speed for more noticeable effect
      const blinkSpeed = 0.08;
      const blinkValue = Math.sin(tick * blinkSpeed + star.blinkPhase) * 0.5 + 0.5;
      return star.baseAlpha * (0.3 + blinkValue * 0.7); // Blink between 30% and 100% of base alpha
    };

    const getOscillatedPosition = (star: Star) => {
      // Local oscillation/to-and-fro motion
      const oscillationSpeedX = 0.015;
      const oscillationSpeedY = 0.012;
      
      const offsetX = Math.sin(tick * oscillationSpeedX + star.oscillationPhaseX) * star.oscillationRangeX;
      const offsetY = Math.sin(tick * oscillationSpeedY + star.oscillationPhaseY) * star.oscillationRangeY;
      
      return {
        x: star.originalX + offsetX,
        y: star.originalY + offsetY,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      tick++;

      // Draw all stars with blinking and oscillation
      for (const star of stars) {
        const blinkAlpha = getBlink(star);
        const pos = getOscillatedPosition(star);
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${blinkAlpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(draw);
    }
    
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default HeroStarfield;
