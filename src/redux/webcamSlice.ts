import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Box, FaceExpressions, Gender } from 'face-api.js';

export type FaceData = {
    age: number;
    gender: Gender;
    genderProbability: number;
    expressions: Record<string, number>;
    box: Box<any>;
};

interface WebcamState {
    isStreaming: boolean;
    detectedFaces: FaceData[];
}

const initialState: WebcamState = {
    isStreaming: false,
    detectedFaces: [],
};

const webcamSlice = createSlice({
    name: 'webcam',
    initialState,
    reducers: {
        setStreaming(state, action: PayloadAction<boolean>) {
            state.isStreaming = action.payload;
        },
        setDetectedFaces(state, action: PayloadAction<FaceData[]>) {
            state.detectedFaces = action.payload;
        },
    },
});

export const { setStreaming, setDetectedFaces } = webcamSlice.actions;
export default webcamSlice.reducer;
