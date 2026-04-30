import * as THREE from "three";

/**
 * Brand colors for specific tech names
 */
const brandColors: Record<string, string> = {
  HuggingFace: "#FFD21E", // HuggingFace yellow
  Vercel: "#FFFFFF", // Vercel white (pyramid logo)
  MediaPipe: "#0F6294", // MediaPipe blue
  Python: "#3776AB", // Python blue
  PyTorch: "#EE4C2C", // PyTorch orange/red
  TensorFlow: "#FF6F00", // TensorFlow orange
  Keras: "#D00000", // Keras red
  React: "#61DAFB", // React cyan
  Docker: "#2496ED", // Docker blue
  FastAPI: "#009688", // FastAPI teal
};

/**
 * Applies color tint to canvas by replacing dark pixels with the target color
 * For white logos, applies a glow effect instead
 * This colorizes monochromatic SVGs to show their brand colors
 */
function applyColorTint(canvas: HTMLCanvasElement, colorHex: string, name: string): void {
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert hex to RGB
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);

  // Special handling for white Vercel logo - preserve white and maximize contrast
  const isVercel = name === "Vercel";

  // Replace black/dark pixels with the brand color while preserving alpha
  for (let i = 0; i < data.length; i += 4) {
    const pixelR = data[i];
    const pixelG = data[i + 1];
    const pixelB = data[i + 2];
    const pixelA = data[i + 3];

    // If pixel is not transparent
    if (pixelA > 50) {
      const brightness = (pixelR + pixelG + pixelB) / 3;
      
      if (isVercel) {
        // For Vercel: Convert ALL non-transparent pixels to pure white
        // This ensures the pyramid is always visible as white
        if (brightness < 250) {
          // Replace non-white pixels with white
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        }
      } else {
        // For other techs: replace dark pixels with brand color
        if (brightness < 150) {
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          // Keep original alpha
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Loads an SVG from URL and converts it to a Three.js texture with color preservation
 */
export async function loadSVGAsTexture(
  svgUrl: string,
  name: string,
  color: string = "#38BDF8"
): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    // Try loading as image first (for PNG/raster formats)
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Successfully loaded, convert to canvas texture
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, 128, 128);

      // Apply brand color tinting if available
      const brandColor = brandColors[name];
      if (brandColor) {
        applyColorTint(canvas, brandColor, name);
      }

      const texture = new THREE.CanvasTexture(canvas);
      resolve(texture);
    };

    img.onerror = () => {
      // Fallback: fetch SVG and render to canvas
      fetch(svgUrl, {
        headers: {
          Accept: "image/svg+xml, application/svg+xml, */*",
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const svgImg = new Image();
          svgImg.crossOrigin = "anonymous";

          svgImg.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(svgImg, 0, 0, 128, 128);

            // Apply brand color tinting
            const brandColor = brandColors[name];
            if (brandColor) {
              applyColorTint(canvas, brandColor, name);
            }

            URL.revokeObjectURL(url);
            const texture = new THREE.CanvasTexture(canvas);
            resolve(texture);
          };

          svgImg.onerror = () => {
            URL.revokeObjectURL(url);
            // Final fallback: colored circle with brand color
            const canvas = document.createElement("canvas");
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext("2d")!;

            const brandColor = brandColors[name] || color;
            const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 70);
            gradient.addColorStop(0, brandColor + "CC");
            gradient.addColorStop(1, brandColor + "88");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(64, 64, 60, 0, Math.PI * 2);
            ctx.fill();

            // Draw border
            ctx.strokeStyle = brandColor + "FF";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(64, 64, 60, 0, Math.PI * 2);
            ctx.stroke();

            // Draw text
            ctx.fillStyle = "#E6F1FF";
            ctx.font = "bold 54px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(name[0].toUpperCase(), 64, 64);

            const texture = new THREE.CanvasTexture(canvas);
            resolve(texture);
          };

          svgImg.src = url;
        })
        .catch(() => {
          // Ultimate fallback: brand colored circle
          const canvas = document.createElement("canvas");
          canvas.width = 128;
          canvas.height = 128;
          const ctx = canvas.getContext("2d")!;

          const brandColor = brandColors[name] || color;
          const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 70);
          gradient.addColorStop(0, brandColor + "CC");
          gradient.addColorStop(1, brandColor + "88");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(64, 64, 60, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = brandColor + "FF";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(64, 64, 60, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#E6F1FF";
          ctx.font = "bold 54px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(name[0].toUpperCase(), 64, 64);

          const texture = new THREE.CanvasTexture(canvas);
          resolve(texture);
        });
    };

    // Set the image src to trigger loading
    img.src = svgUrl;
  });
}

/**
 * Preload all SVG textures for the tech sphere
 */
export async function preloadAllTextures(
  markers: Array<{ name: string; iconUrl: string; category: string }>,
  categoryColor: Record<string, string>
): Promise<Map<string, THREE.Texture>> {
  const textureMap = new Map<string, THREE.Texture>();

  const promises = markers.map(async (marker) => {
    try {
      const texture = await loadSVGAsTexture(
        marker.iconUrl,
        marker.name,
        categoryColor[marker.category] || "#38BDF8"
      );
      textureMap.set(marker.name, texture);
    } catch (error) {
      console.warn(`Failed to load texture for ${marker.name}:`, error);
    }
  });

  await Promise.all(promises);
  return textureMap;
}
