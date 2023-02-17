import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import Webcam from 'react-webcam';
import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { detector, poseClassifier } from '../App';

let interval;

const Yoga = () => {
    const location = useLocation();
    const { exerciseName } = location.state;

    const [ countdown, setCountdown ] = useState(20000);
    const countdownRef = useRef(20000);

    //Không thể dùng useState (lý do ở component Test)
    // const [ isStart, setIsStart ] = useState(false);
    // const [ isPause, setIsPause ] = useState(false);
    // const [ startTime, setStartTime ] = useState();

    const startTimeRef = useRef();  
    const flag = useRef();  //default undefined, dùng !isStartRef.current -> true

    const requestRef = useRef();

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const completedRef = useRef();

    //completedRef.current.style.visibility = "hidden"; //không được, kể cả ref cũng cần được mount trước khi sử dụng
    //dùng useEffect vì useEffect sẽ chạy sau khi mount lần đầu
    useEffect(() => {
        completedRef.current.style.visibility = "hidden";
    }, [])

    const loadModel = async () => {
        const detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        };
        const detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            detectorConfig
        );
        const poseClassifier = await tf.loadLayersModel(
            "./models/model.json"
        );
        console.log("loadmodel");
        // interval = setInterval(() => {
        //     predictWebcam(detector, poseClassifier)
        // }, 100);
        
        requestRef.current = requestAnimationFrame(() => {
            predictWebcam(detector, poseClassifier);
        })
    }

    //Lấy model chung từ App component (chỉ load 1 lần duy nhất), nếu dùng trong Home vẫn load lại khi re-render home
    //Vẫn gây vấn đề về hiệu suất
    // useEffect(() => {
    //     requestRef.current = requestAnimationFrame(() => {
    //         predictWebcam(detector, poseClassifier);
    //     })
    // })

    const draw = (canvas, video, poses) => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0);
        for (let i = 0; i < 17; i++) {
            const x = poses[0].keypoints[i].x;
            const y = poses[0].keypoints[i].y;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "gray";
            ctx.fill();
            ctx.stroke();
        }
        const couplePoints = [
            [0, 1],
            [0, 2],
            [1, 3],
            [2, 4],
            [5, 6],
            [6, 8],
            [8, 10],
            [5, 7],
            [7, 9],
            [6, 12],
            [12, 14],
            [14, 16],
            [5, 11],
            [11, 13],
            [13, 15],
            [11, 12],
        ];
        for (let i = 0; i < couplePoints.length; i++) {
            const x1 = poses[0].keypoints[couplePoints[i][0]].x;
            const y1 = poses[0].keypoints[couplePoints[i][0]].y;
            const x2 = poses[0].keypoints[couplePoints[i][1]].x;
            const y2 = poses[0].keypoints[couplePoints[i][1]].y;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    };

    const CLASS_NO = {
        Chair: 0,
        Cobra: 1,
        Dog: 2,
        No_Pose: 3,
        Shoulderstand: 4,
        Traingle: 5,
        Tree: 6,
        Warrior: 7,
    };

    const NO_CLASS = ["Chair", "Cobra", "Dog", "No_Pose", "Shoulderstand", "Traingle", "Tree", "Warrior"];

    const POINTS = {
        NOSE: 0,
        LEFT_EYE: 1,
        RIGHT_EYE: 2,
        LEFT_EAR: 3,
        RIGHT_EAR: 4,
        LEFT_SHOULDER: 5,
        RIGHT_SHOULDER: 6,
        LEFT_ELBOW: 7,
        RIGHT_ELBOW: 8,
        LEFT_WRIST: 9,
        RIGHT_WRIST: 10,
        LEFT_HIP: 11,
        RIGHT_HIP: 12,
        LEFT_KNEE: 13,
        RIGHT_KNEE: 14,
        LEFT_ANKLE: 15,
        RIGHT_ANKLE: 16,
    }

    function get_center_point(landmarks, left_bodypart, right_bodypart) {
        let left = tf.gather(landmarks, left_bodypart, 1);
        let right = tf.gather(landmarks, right_bodypart, 1);
        const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
        return center;
    }

    function get_pose_size(landmarks, torso_size_multiplier = 2.5) {
        let hips_center = get_center_point(
            landmarks,
            POINTS.LEFT_HIP,
            POINTS.RIGHT_HIP
        );
        let shoulders_center = get_center_point(
            landmarks,
            POINTS.LEFT_SHOULDER,
            POINTS.RIGHT_SHOULDER
        );
        let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
        let pose_center_new = get_center_point(
            landmarks,
            POINTS.LEFT_HIP,
            POINTS.RIGHT_HIP
        );
        pose_center_new = tf.expandDims(pose_center_new, 1);

        pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);
        // return: shape(17,2)
        let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
        let max_dist = tf.max(tf.norm(d, "euclidean", 0));

        // normalize scale
        let pose_size = tf.maximum(
            tf.mul(torso_size, torso_size_multiplier),
            max_dist
        );
        return pose_size;
    }

    function normalize_pose_landmarks(landmarks) {
        let pose_center = get_center_point(
            landmarks,
            POINTS.LEFT_HIP,
            POINTS.RIGHT_HIP
        );
        pose_center = tf.expandDims(pose_center, 1);
        pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
        landmarks = tf.sub(landmarks, pose_center);

        let pose_size = get_pose_size(landmarks);
        landmarks = tf.div(landmarks, pose_size);
        return landmarks;
    }

    function landmarks_to_embedding(landmarks) {
        // normalize landmarks 2D
        landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
        let embedding = tf.reshape(landmarks, [1, 34]);
        return embedding;
    }

    function predictWebcam(detector, poseClassifier) {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            video.style.transform = "rotateY(180deg)";
            const outputCanvas = canvasRef.current;
            outputCanvas.style.transform = "rotateY(180deg)";
            detector.estimatePoses(video).then((poses) => {
                draw(outputCanvas, video, poses);
                const keypoints = poses[0].keypoints;
                let input = keypoints.map((keypoint) => {
                    return [keypoint.x, keypoint.y]
                })
                const processedInput = landmarks_to_embedding(input)
                const classification = poseClassifier.predict(processedInput)
                classification.array().then((data) => {
                    const exerciseIndex = NO_CLASS.indexOf(exerciseName);
                    //real

                    if (data[0][exerciseIndex] > 0.97 && Boolean(flag.current) == false ) { //chưa bắt đầu, tập đúng động tác
                        flag.current = true;
                        startTimeRef.current = new Date();
                    } else if (data[0][exerciseIndex] > 0.97 && flag.current == true) {   //đã bắt đầu, tập đúng động tác
                        if (countdownRef.current > 0){
                            countdownRef.current = countdownRef.current - (new Date() - startTimeRef.current);
                            setCountdown((prev) => prev - (new Date() - startTimeRef.current));
                            startTimeRef.current = new Date();  //very important
                        } else {
                            completedRef.current.style.visibility = "visible";
                        }
                    } else if (data[0][exerciseIndex] <= 0.97 && flag.current == true) {  //đã bắt đầu, tập sai động tác
                        flag.current = false;
                    }

                    for (let i = 0; i < 8; i++) {
                        //test
                        if (data[0][i] > 0.97) {
                            console.log(NO_CLASS[i]);
                        }
                    }
                })
            });
        }
        requestRef.current = requestAnimationFrame(() => {
            predictWebcam(detector, poseClassifier);
        });
    }

    return (
        <div className='yoga-container'>
            <Link to='/'>Home</Link>
            <h1>{exerciseName}</h1>
            <h2>Countdown: {countdown}</h2>
            <div className="completed" ref={completedRef}>Completed!</div>
            <Webcam
                width='640px'
                height='480px'
                id="webcam"
                ref={webcamRef}
            />
            <canvas
                ref={canvasRef}
                id="my-canvas"
                width='640px'
                height='480px'
            >
            </canvas>
            <button onClick={loadModel}>RUN</button>
        </div>
    );
}
export default Yoga;