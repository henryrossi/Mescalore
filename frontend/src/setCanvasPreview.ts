import { PixelCrop } from "react-image-crop";

export default function setCanvasPreview(image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("No 2d context");
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = 600;
    canvas.height = 600;

    ctx.imageSmoothingQuality = "high";
    ctx.save();
    
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        600,
        600
    );

    ctx.restore();
};