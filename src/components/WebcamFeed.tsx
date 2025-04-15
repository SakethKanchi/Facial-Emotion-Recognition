import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { loadModels } from '../utils/loadModels';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setDetectedFaces, setStreaming } from '../redux/webcamSlice';

const WebcamFeed: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dispatch = useDispatch();
    const streaming = useSelector((state: RootState) => state.webcam.isStreaming);
    const detectedFaces = useSelector((state: RootState) => state.webcam.detectedFaces);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

    const startWebcam = async () => {
        try {
            await loadModels();

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                dispatch(setStreaming(true));
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
        }
    };

    const stopWebcam = () => {
        if (intervalId) clearInterval(intervalId);

        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());

        if (videoRef.current) videoRef.current.srcObject = null;
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        dispatch(setStreaming(false));
        dispatch(setDetectedFaces([]));
    };

    const handleVideoPlay = () => {
        const id = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current) return;

            const detections = await faceapi
                .detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceExpressions()
                .withAgeAndGender();

            const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
            const resized = faceapi.resizeResults(detections, dims);

            const ctx = canvasRef.current.getContext("2d");
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resized);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

            resized.forEach(result => {
                const { age, gender, genderProbability } = result;
                const box = result.detection.box;
                const text = `${Math.round(age)} yrs, ${gender} (${(genderProbability * 100).toFixed(1)}%)`;
                const drawBox = new faceapi.draw.DrawBox(box, { label: text });
                drawBox.draw(canvasRef.current!);
            });

            dispatch(setDetectedFaces(
                resized.map(result => ({
                    age: result.age,
                    gender: result.gender,
                    genderProbability: result.genderProbability,
                    expressions: result.expressions as unknown as Record<string, number>,
                    box: result.detection.box
                }))
            ));
        }, 100);

        setIntervalId(id);
    };

    useEffect(() => {
        return () => stopWebcam(); // Cleanup on unmount
    }, []);

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="card-title">Live Webcam Feed</h2>
                <div className="position-relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        width="100%"
                        height="auto"
                        onPlay={handleVideoPlay}
                        className="rounded w-100"
                    />
                    <canvas
                        ref={canvasRef}
                        width="640"
                        height="480"
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{ pointerEvents: 'none' }}
                    />
                </div>

                <div className="mt-3">
                    {!streaming ? (
                        <button className="btn btn-primary" onClick={startWebcam}>
                            Start Webcam
                        </button>
                    ) : (
                        <button className="btn btn-danger" onClick={stopWebcam}>
                            Stop Webcam
                        </button>
                    )}
                </div>

                {detectedFaces.length > 0 && (
                    <div className="mt-4">
                        <h5>Detected Faces</h5>
                        {detectedFaces.map((face, i) => (
                            <div key={i} className="mb-2">
                                <strong>Face {i + 1}:</strong> Age: {Math.round(face.age)}, Gender: {face.gender} ({(face.genderProbability * 100).toFixed(1)}%)<br />
                                <small className="text-muted">
                                    Emotions: {Object.entries(face.expressions)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([emo, val]) => `${emo} (${(val * 100).toFixed(1)}%)`)
                                        .join(', ')}
                                </small>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebcamFeed;
