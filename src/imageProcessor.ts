import sharp from 'sharp';
import path from 'path';

interface ProcessedImage {
    originalSize: number | undefined;
    processedSize: number;
    width: number | undefined;
    height: number | undefined;
    format: string | undefined;
}

export async function processImage(imagePath: string): Promise<ProcessedImage> {
    try {
        const image = sharp(path.resolve(imagePath));
        
        const metadata = await image.metadata();
        
        const processed = await image
            .resize(800, 600, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .sharpen()
            .toBuffer();

        return {
            originalSize: metadata.size,
            processedSize: processed.length,
            width: metadata.width,
            height: metadata.height,
            format: metadata.format
        };
    } catch (error: any) {
        throw new Error(`Image processing failed: ${error.message}`);
    }
}
