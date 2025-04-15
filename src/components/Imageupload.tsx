import React, { useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { loadModels } from '../utils/loadModels';

const ImageUpload: React.FC = () => {
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [faceInfo, setFaceInfo] = useState<string[]>([]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await loadModels();

        const image = await faceapi.bufferToImage(file);
        if (imageRef.current) {
            imageRef.current.src = image.src;
        }

        setFaceInfo([]);

        // Wait until the image is fully loaded
        setTimeout(async () => {
            if (!imageRef.current || !canvasRef.current) return;

            // Set canvas size to match the image
            const { width, height } = imageRef.current;
            canvasRef.current.width = width;
            canvasRef.current.height = height;

            const detections = await faceapi
                .detectAllFaces(imageRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions()
                .withAgeAndGender();

            // Resize detections to match the image size
            const dims = faceapi.matchDimensions(canvasRef.current, { width, height });
            const resized = faceapi.resizeResults(detections, dims);

            const ctx = canvasRef.current.getContext("2d");
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resized);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

            const info = resized.map((res, i) => {
                const { age, gender, genderProbability } = res;
                const emotions = Object.entries(res.expressions)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emo, val]) => `${emo} (${(val * 100).toFixed(1)}%)`)
                    .join(', ');
                return `Face ${i + 1}: ${Math.round(age)} yrs, ${gender} (${(genderProbability * 100).toFixed(1)}%) — Emotions: ${emotions}`;
            });

            setFaceInfo(info);
        }, 200);
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h2 className="card-title">Upload Image</h2>
                <input type="file" className="form-control mb-3" accept="image/*" onChange={handleImageChange} />

                <div className="position-relative mt-3" style={{ display: 'inline-block' }}>
                    <img
                        ref={imageRef}
                        alt="Uploaded"
                        className="rounded"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                    <canvas
                        ref={canvasRef}
                        className="position-absolute top-0 start-0"
                        style={{ pointerEvents: 'none' }}
                    />
                </div>


                {faceInfo.length > 0 && (
                    <div className="mt-4">
                        <h5>Detected Faces</h5>
                        {faceInfo.map((text, i) => (
                            <p key={i} className="text-muted small">{text}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default ImageUpload;