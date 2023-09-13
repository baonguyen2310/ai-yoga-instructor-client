import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import './App.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Yoga from './pages/Yoga';
import YogaApp from './pages/YogaApp';
import YogaApp2 from './pages/YogaApp2';
import YogaApp2Chain from './pages/YogaApp2Chain';
import Test from './components/Test';
import { useEffect } from 'react';

import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

let detector;
let poseClassifier;

//const HOST = "http://localhost:5000";
const HOST = "https://medicine-keeper-server-production.up.railway.app";
export {HOST};

const App = () => {
    //Vấn đề hiệu suất chưa sửa nên không dùng được
    // useEffect(() => {
    //     const detectorConfig = {
    //       modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    //     };
    //     poseDetection.createDetector(
    //       poseDetection.SupportedModels.MoveNet,
    //       detectorConfig
    //     ).then((_detector) => {
    //       detector = _detector;
    //       console.log("loadmodel movenet")
    //     })
    //     tf.loadLayersModel(
    //       "http://localhost:3000/models/model.json"
    //     ).then((_poseClassifier) => {
    //       poseClassifier = _poseClassifier;
    //       console.log("loadmodel classifier");
    //     })
    //   }, [])

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/yoga' element={<Yoga />} />
                <Route path='/yogaapp' element={<YogaApp2 />} />
                <Route path='/yogaappchain' element={<YogaApp2Chain />} />
                <Route path='/test' element={<Test />} />
            </Routes>
        </Router>
    );
}

export default App;

export { detector, poseClassifier }