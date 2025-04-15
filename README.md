# 🧠 Facial Recognition Web App (React + TypeScript + face-api.js)

This web application uses real-time webcam or uploaded images to detect and analyze faces. It can estimate a person’s **age**, **gender**, and **emotions** using machine learning models in the browser — no backend required!

Built with **React**, **Redux**, **TypeScript**, and styled with **Bootstrap 5**.

---

## 📸 Features

- 🎥 **Live webcam facial detection**
- 🖼️ **Image upload support** for facial analysis
- 👦 Estimated **age**, **gender**, and **emotion recognition**
- 🧠 Powered by `face-api.js` (TensorFlow.js wrapper)
- 🌐 Fully browser-based — no server or cloud calls
- 📱 Responsive UI using Bootstrap
- 💾 Global state with Redux Toolkit

---

## 🚀 Demo

<!-- Add a gif/screenshot here -->
<p align="center">
  <img src="demo.png" alt="Demo Screenshot" width="600" />
</p>

---

## 🧰 Tech Stack

| Technology     | Purpose                                |
|----------------|----------------------------------------|
| React          | Frontend framework                     |
| TypeScript     | Static typing                          |
| Redux Toolkit  | App state management                   |
| face-api.js    | Face detection + emotion/age/gender    |
| Bootstrap 5    | Styling and responsive design          |
| MediaDevices API | Webcam access in browser            |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SakethKanchi/Facial-Emotion-Recognition.git
cd facial-emotion-recognition
```

### 2. 3. Download Face-api Models
Download the following models and place them in the public/models/ folder:

```
tiny_face_detector
age_gender
face_expression
```
You can download them from: https://github.com/justadudewhohacks/face-api.js-models

Directory structure:

```pgsql
public/
└── models/
    ├── tiny_face_detector_model-weights_manifest.json
    ├── age_gender_model-weights_manifest.json
    └── face_expression_model-weights_manifest.json
```

### 4. Start the App
```bash
npm start
The app will run at http://localhost:3000
```


📁 Project Structure
``` bash
src/
├── components/
│   ├── WebcamFeed.tsx      # Webcam interface & detection
│   ├── ImageUpload.tsx     # Image upload detection
├── redux/
│   ├── store.ts            # Redux store setup
│   └── webcamSlice.ts      # Slice for face data + webcam state
├── utils/
│   └── loadModels.ts       # Loads face-api.js models
├── App.tsx
└── index.tsx
```

### 🙌 Contributing
> Contributions are welcome! Feel free to open issues or submit pull requests.

