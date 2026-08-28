import os
import glob
from PIL import Image, ImageFilter
import numpy as np

def clean_image(image_path):
    try:
        img = Image.open(image_path).convert('RGB')
        w, h = img.size
        arr = np.array(img, dtype=np.float32)
        
        # 1. Detect text in top 24% of image (where title banners are placed)
        top_h = int(h * 0.24)
        top_region = arr[:top_h, :, :]
        
        # In all studio images, the text is pure white or near-white letters (R>180, G>150, B>120 and brightness > 185)
        # Background is warm tan/brown (R: 130-180, G: 100-140, B: 60-100)
        # White text mask:
        luminance = 0.299 * top_region[:, :, 0] + 0.587 * top_region[:, :, 1] + 0.114 * top_region[:, :, 2]
        
        # Detect bright text pixels
        # Also detect drop shadows (high gradient near bright pixels)
        text_pixels = (luminance > 185) & (top_region[:, :, 0] > 165)
        
        # Also check for dark drop shadows of text (pixels with high local variance in top region)
        # Dilate the text mask to completely cover text borders, antialiasing and drop shadow
        dilated = np.copy(text_pixels)
        for dy in range(-6, 7):
            for dx in range(-6, 7):
                shifted = np.roll(np.roll(text_pixels, dy, axis=0), dx, axis=1)
                dilated = dilated | shifted
                
        # Also check left badge icons (x < w*0.22, y from h*0.3 to h*0.65)
        badge_top = int(h * 0.30)
        badge_bottom = int(h * 0.65)
        badge_w = int(w * 0.22)
        badge_region = arr[badge_top:badge_bottom, :badge_w, :]
        badge_lum = 0.299 * badge_region[:, :, 0] + 0.587 * badge_region[:, :, 1] + 0.114 * badge_region[:, :, 2]
        badge_pixels = (badge_lum > 190)
        dilated_badge = np.copy(badge_pixels)
        for dy in range(-4, 5):
            for dx in range(-4, 5):
                shifted = np.roll(np.roll(badge_pixels, dy, axis=0), dx, axis=1)
                dilated_badge = dilated_badge | shifted

        # Reconstruct / inpaint top region
        # For the top region, the background is a smooth studio wall / gradient
        # We can interpolate the clean background vertically and horizontally
        result_top = np.copy(top_region)
        
        # Create a background model by sampling clean non-masked rows
        # If rows below top_h are clean background, sample them
        for x in range(w):
            col_mask = dilated[:, x]
            if np.any(col_mask):
                # Sample clean background above or below
                non_masked = np.where(~col_mask)[0]
                if len(non_masked) > 0:
                    # Nearest non-masked pixel or mean of nearest
                    for y in np.where(col_mask)[0]:
                        # Find closest non-masked y
                        closest_y = non_masked[np.argmin(np.abs(non_masked - y))]
                        result_top[y, x, :] = top_region[closest_y, x, :]
                else:
                    # If whole column is masked, sample from row top_h
                    result_top[col_mask, x, :] = arr[top_h + 5, x, :]
                    
        # Apply smooth 2D blur to the inpainted region
        top_pil = Image.fromarray(result_top.astype(np.uint8))
        top_blur = top_pil.filter(ImageFilter.GaussianBlur(radius=7))
        
        mask_pil = Image.fromarray((dilated * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=4))
        clean_top = Image.composite(top_blur, Image.fromarray(top_region.astype(np.uint8)), mask_pil)
        
        # Replace top region
        img.paste(clean_top, (0, 0))
        
        # Inpaint left badge region if any detected
        if np.sum(badge_pixels) > 50:
            result_badge = np.copy(badge_region)
            for y in range(badge_bottom - badge_top):
                row_mask = dilated_badge[y, :]
                if np.any(row_mask):
                    non_masked = np.where(~row_mask)[0]
                    if len(non_masked) > 0:
                        for x in np.where(row_mask)[0]:
                            closest_x = non_masked[np.argmin(np.abs(non_masked - x))]
                            result_badge[y, x, :] = badge_region[y, closest_x, :]
            
            badge_pil = Image.fromarray(result_badge.astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=6))
            badge_mask_pil = Image.fromarray((dilated_badge * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=4))
            clean_badge = Image.composite(badge_pil, Image.fromarray(badge_region.astype(np.uint8)), badge_mask_pil)
            img.paste(clean_badge, (0, badge_top))
            
        img.save(image_path, quality=95)
        print(f"✓ Cleaned: {os.path.basename(image_path)}")
    except Exception as e:
        print(f"Error on {image_path}: {e}")

# Process all product PNGs
images = glob.glob('public/images/products/*.png')
print(f"Cleaning {len(images)} product images...")
for img_path in sorted(images):
    clean_image(img_path)

print("All product images cleaned!")
