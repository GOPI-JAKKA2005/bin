/**
 * HTML5 Canvas Client-Side Image Compression & Real Pixel Sampling Engine
 * Extracts true RGB & HSV (Hue, Saturation, Brightness) color metrics directly from canvas pixels.
 */

export async function compressImage(imageInput, targetKB = 500) {
  return new Promise((resolve, reject) => {
    let sourceDataUrl = '';

    if (typeof imageInput === 'string') {
      sourceDataUrl = imageInput;
      processCompression(sourceDataUrl);
    } else if (imageInput instanceof File || imageInput instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        sourceDataUrl = e.target.result;
        processCompression(sourceDataUrl);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(imageInput);
    } else {
      reject(new Error('Invalid image input format.'));
    }

    function processCompression(dataUrl) {
      const initialSizeKB = Math.round((dataUrl.length * 0.75) / 1024);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // SAMPLE REAL RGB & HSV PIXEL COLOR SPECTRUM ACROSS ENTIRE CANVAS
        let visualAnalysis = null;
        try {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          let rTotal = 0, gTotal = 0, bTotal = 0;
          let pixelCount = 0;

          let yellowPixelCount = 0;
          let greenPixelCount = 0;
          let purpleRedPixelCount = 0;
          let neutralPixelCount = 0;

          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            rTotal += r;
            gTotal += g;
            bTotal += b;
            pixelCount++;

            // Convert RGB to HSV Hue Angle (0 - 360 deg)
            const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
            const max = Math.max(rNorm, gNorm, bNorm);
            const min = Math.min(rNorm, gNorm, bNorm);
            const delta = max - min;

            let hue = 0;
            if (delta > 0) {
              if (max === rNorm) hue = ((gNorm - bNorm) / delta) % 6;
              else if (max === gNorm) hue = (bNorm - rNorm) / delta + 2;
              else hue = (rNorm - gNorm) / delta + 4;
              hue = Math.round(hue * 60);
              if (hue < 0) hue += 360;
            }

            const saturation = max > 0 ? (delta / max) * 100 : 0;

            if (saturation > 15) {
              if (hue >= 35 && hue <= 68) yellowPixelCount++;
              else if (hue >= 70 && hue <= 165) greenPixelCount++;
              else if ((hue >= 260 && hue <= 350) || (hue >= 0 && hue <= 25)) purpleRedPixelCount++;
            } else {
              neutralPixelCount++;
            }
          }

          const avgR = Math.round(rTotal / (pixelCount || 1));
          const avgG = Math.round(gTotal / (pixelCount || 1));
          const avgB = Math.round(bTotal / (pixelCount || 1));

          let dominantCategoryHint = 'dry';
          let detectedObjectHint = 'Mixed Plastic Packaging, Cups & Disposable Containers';

          // Multi-color spectrum detection for mixed plastic trash (cups, bags, straws, wrappers)
          const hasMultiColorAccents = (yellowPixelCount > 0 ? 1 : 0) + (greenPixelCount > 0 ? 1 : 0) + (purpleRedPixelCount > 0 ? 1 : 0) >= 2;

          if (rTotal > gTotal * 1.5 && rTotal > bTotal * 1.5 && avgR > 140) {
            // High crimson / biohazard alert indicator
            dominantCategoryHint = 'biomedical';
            detectedObjectHint = 'Clinical Sharps & Biomedical Biohazard Item';
          } else if (greenPixelCount > yellowPixelCount && greenPixelCount > purpleRedPixelCount && greenPixelCount > pixelCount * 0.2) {
            dominantCategoryHint = 'wet';
            detectedObjectHint = 'Banana Leaves & Plant Stalks';
          } else if (purpleRedPixelCount > yellowPixelCount && purpleRedPixelCount > greenPixelCount && purpleRedPixelCount > pixelCount * 0.25) {
            dominantCategoryHint = 'wet';
            detectedObjectHint = 'Bunch of Grapes & Plum Fruit Residues';
          } else if (yellowPixelCount > greenPixelCount * 2.5 && yellowPixelCount > purpleRedPixelCount * 2.5 && yellowPixelCount > pixelCount * 0.35 && neutralPixelCount < pixelCount * 0.3) {
            dominantCategoryHint = 'wet';
            detectedObjectHint = 'Banana Peels (Organic Food Scraps)';
          } else if (neutralPixelCount > pixelCount * 0.30 || hasMultiColorAccents) {
            // High clear/white plastics, cups, bags, straws, thermoformed containers
            dominantCategoryHint = 'mixed_plastics';
            detectedObjectHint = 'Mixed Plastic Packaging, Cups & Disposable Containers';
          }

          visualAnalysis = {
            avgR, avgG, avgB,
            pixelCount,
            yellowPixelCount,
            greenPixelCount,
            purpleRedPixelCount,
            neutralPixelCount,
            hasMultiColorAccents,
            dominantCategoryHint,
            detectedObjectHint
          };
        } catch (e) {
          console.warn('Pixel sampling warning:', e);
        }

        // Iteratively compress JPEG quality until <= targetKB
        let quality = 0.88;
        let resultBase64 = canvas.toDataURL('image/jpeg', quality);
        let finalSizeKB = Math.round((resultBase64.length * 0.75) / 1024);

        while (finalSizeKB > targetKB && quality > 0.3) {
          quality -= 0.1;
          resultBase64 = canvas.toDataURL('image/jpeg', quality);
          finalSizeKB = Math.round((resultBase64.length * 0.75) / 1024);
        }

        const reductionPercent = Math.round(((initialSizeKB - finalSizeKB) / initialSizeKB) * 100);

        resolve({
          compressedBase64: resultBase64,
          initialSizeKB,
          finalSizeKB,
          targetKB,
          reductionPercent: Math.max(0, reductionPercent),
          isCompressed: finalSizeKB !== initialSizeKB,
          visualAnalysis,
          message: `Processed image (${finalSizeKB}KB). Real pixel HSV analysis complete.`
        });
      };

      img.onerror = (err) => reject(new Error('Failed to load image for canvas compression.'));
      img.src = dataUrl;
    }
  });
}

