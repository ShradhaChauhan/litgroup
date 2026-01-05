#!/usr/bin/env python3
"""
Script to help optimize images for production:
1. Re-compress WebP images with optimal quality settings
2. Generate multiple sizes for responsive images
3. Analyze image usage and provide recommendations
"""

import os
from PIL import Image
from pathlib import Path

def analyze_image(image_path):
    """Analyze an image and return metadata."""
    try:
        img = Image.open(image_path)
        width, height = img.size
        file_size = os.path.getsize(image_path)
        
        return {
            'width': width,
            'height': height,
            'size_kb': file_size / 1024,
            'mode': img.mode,
            'format': img.format
        }
    except Exception as e:
        return {'error': str(e)}

def recompress_webp(image_path, quality=85, lossless=False):
    """Re-compress a WebP image with specified quality."""
    try:
        img = Image.open(image_path)
        
        # Determine if image has transparency
        has_transparency = img.mode in ('RGBA', 'LA', 'P')
        
        if has_transparency:
            if img.mode != 'RGBA':
                if img.mode == 'P':
                    img = img.convert('RGBA')
                elif img.mode == 'LA':
                    rgb = Image.new('RGB', img.size, (255, 255, 255))
                    rgb.paste(img, mask=img.split()[1] if len(img.split()) > 1 else None)
                    alpha = img.split()[0] if len(img.split()) > 0 else None
                    img = Image.merge('RGBA', (*rgb.split(), alpha) if alpha else (*rgb.split(), Image.new('L', img.size, 255)))
                else:
                    img = img.convert('RGBA')
            
            # Use lossless for transparent images, or high quality
            if lossless:
                img.save(image_path, 'WEBP', lossless=True, method=6)
            else:
                img.save(image_path, 'WEBP', quality=quality, method=6)
        else:
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            img.save(image_path, 'WEBP', quality=quality, method=6)
        
        return True
    except Exception as e:
        print(f"Error compressing {image_path}: {e}")
        return False

def generate_responsive_sizes(image_path, base_name, sizes=[400, 800, 1200, 1600]):
    """Generate multiple sizes of an image for responsive srcset."""
    try:
        img = Image.open(image_path)
        original_width, original_height = img.size
        
        generated = []
        
        for size in sizes:
            if size >= original_width:
                continue  # Don't upscale
            
            # Calculate proportional height
            aspect_ratio = original_height / original_width
            new_height = int(size * aspect_ratio)
            
            # Resize image
            resized = img.resize((size, new_height), Image.Resampling.LANCZOS)
            
            # Generate filename
            base_path = Path(image_path)
            new_filename = f"{base_path.stem}-{size}w{base_path.suffix}"
            new_path = base_path.parent / new_filename
            
            # Save
            if img.mode == 'RGBA' or img.mode in ('LA', 'P'):
                if img.mode != 'RGBA':
                    resized = resized.convert('RGBA')
                resized.save(new_path, 'WEBP', quality=85, method=6)
            else:
                if resized.mode != 'RGB':
                    resized = resized.convert('RGB')
                resized.save(new_path, 'WEBP', quality=85, method=6)
            
            generated.append((new_path, size))
        
        return generated
    except Exception as e:
        print(f"Error generating sizes for {image_path}: {e}")
        return []

def main():
    print("=" * 60)
    print("Image Optimization Tool")
    print("=" * 60)
    print("\nOptions:")
    print("1. Analyze images and show recommendations")
    print("2. Re-compress WebP images with optimal quality")
    print("3. Generate responsive image sizes")
    print("4. Exit")
    
    choice = input("\nSelect option (1-4): ").strip()
    
    if choice == "1":
        analyze_images()
    elif choice == "2":
        recompress_images()
    elif choice == "3":
        generate_responsive()
    elif choice == "4":
        print("Exiting...")
        return
    else:
        print("Invalid choice")

def analyze_images():
    """Analyze all images and provide recommendations."""
    root_dir = os.getcwd()
    webp_images = []
    
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', '.venv', 'venv'}]
        for file in files:
            if file.lower().endswith('.webp'):
                webp_images.append(os.path.join(root, file))
    
    print(f"\nAnalyzing {len(webp_images)} WebP images...\n")
    
    total_size = 0
    large_images = []
    very_large_images = []
    
    for img_path in webp_images[:50]:  # Analyze first 50
        info = analyze_image(img_path)
        if 'error' not in info:
            total_size += info['size_kb']
            
            if info['size_kb'] > 500:  # > 500KB
                very_large_images.append((img_path, info))
            elif info['size_kb'] > 200:  # > 200KB
                large_images.append((img_path, info))
    
    print(f"Total size analyzed: {total_size:.2f} KB")
    print(f"\nLarge images (>200KB): {len(large_images)}")
    print(f"Very large images (>500KB): {len(very_large_images)}")
    
    if very_large_images:
        print("\nVery large images (consider re-compression):")
        for path, info in very_large_images[:5]:
            print(f"  - {path}: {info['size_kb']:.2f} KB ({info['width']}x{info['height']})")

def recompress_images():
    """Re-compress WebP images with optimal quality."""
    print("\nRe-compression Options:")
    print("1. Photos (quality 85)")
    print("2. Graphics/Logos (quality 90)")
    print("3. Thumbnails (quality 75)")
    print("4. Lossless (for transparent images)")
    
    quality_choice = input("\nSelect quality (1-4): ").strip()
    
    quality_map = {
        '1': 85,
        '2': 90,
        '3': 75,
        '4': None  # Lossless
    }
    
    quality = quality_map.get(quality_choice)
    lossless = quality_choice == '4'
    
    if quality is None and not lossless:
        print("Invalid choice")
        return
    
    root_dir = os.getcwd()
    webp_images = []
    
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', '.venv', 'venv'}]
        for file in files:
            if file.lower().endswith('.webp'):
                webp_images.append(os.path.join(root, file))
    
    print(f"\nFound {len(webp_images)} WebP images")
    confirm = input("Proceed with re-compression? (yes/no): ").strip().lower()
    
    if confirm != 'yes':
        print("Cancelled")
        return
    
    compressed = 0
    for img_path in webp_images:
        if recompress_webp(img_path, quality=quality or 90, lossless=lossless):
            compressed += 1
        if compressed % 50 == 0:
            print(f"Compressed {compressed} images...")
    
    print(f"\nCompleted! Compressed {compressed} images")

def generate_responsive():
    """Generate responsive image sizes."""
    print("\nThis will create multiple sizes of images for srcset.")
    print("Example: product.webp -> product-400w.webp, product-800w.webp, etc.")
    
    image_path = input("\nEnter image path (or 'all' for all images): ").strip()
    
    if image_path.lower() == 'all':
        print("Generating responsive sizes for all images is not recommended.")
        print("Please specify individual images or a directory.")
        return
    
    if os.path.isfile(image_path):
        sizes = generate_responsive_sizes(image_path, Path(image_path).stem)
        print(f"\nGenerated {len(sizes)} sizes:")
        for path, size in sizes:
            print(f"  - {path} ({size}w)")
    else:
        print(f"File not found: {image_path}")

if __name__ == '__main__':
    main()

