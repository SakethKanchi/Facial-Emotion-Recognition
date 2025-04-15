import React from 'react';
import WebcamFeed from './components/WebcamFeed';
import ImageUpload from './components/Imageupload';

function App() {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Facial Recognition App</h1>
      <WebcamFeed />
      <hr className="my-4" />
      <ImageUpload />
    </div>
  );
}

export default App;
