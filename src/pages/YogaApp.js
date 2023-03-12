import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import Webcam from "react-webcam";
import { useRef, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, SvgIcon } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import { detector, poseClassifier } from "../App";
import "../assets/css/yoga.css";

//CIRCLE PROCESS
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CircularProgressWithLabel(props) {
  return (
    <Box
      sx={{
        marginTop: "1rem",
        position: "relative",
        display: "block",
        color: "tomato",
      }}
    >
      <CircularProgress size="8rem" variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "tomato",
        }}
      >
        <Typography
          fontWeight="bold"
          variant="caption"
          component="div"
          color="tomato"
          fontSize="2rem"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

//TUTORIAL YOUTUBE LINK
const tutorialLink = {
  Chair: "https://www.youtube.com/embed/NUTWhwm04WY",
  Cobra: "https://www.youtube.com/embed/n6jrC6WeF84",
  Dog: "https://www.youtube.com/embed/j97SSGsnCAQ",
  Shoulderstand: "https://www.youtube.com/embed/UjHTOW9x3WM",
  Traingle: "https://www.youtube.com/embed/upFYlxZHif0",
  Tree: "https://www.youtube.com/embed/ZRS0dXit51Q",
  Warrior: "https://www.youtube.com/embed/HuETB2HA2FM",
};

let interval;

let colorStroke = "gray";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const YogaApp = () => {
  let query = useQuery();
  const exerciseName = query.get("name");

  const [countdown, setCountdown] = useState(20000);
  const countdownRef = useRef(20000);

  const [accuracy, setAccuracy] = useState(0);

  const voiceRef = useRef(false);
  const playTimeRef = useRef(new Date());
  const audioRef = useRef();

  //Không thể dùng useState (lý do ở component Test)
  // const [ isStart, setIsStart ] = useState(false);
  // const [ isPause, setIsPause ] = useState(false);
  // const [ startTime, setStartTime ] = useState();

  const startTimeRef = useRef();
  const flag = useRef(); //default undefined, dùng !isStartRef.current -> true

  const requestRef = useRef();

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const completedRef = useRef();

  //completedRef.current.style.visibility = "hidden"; //không được, kể cả ref cũng cần được mount trước khi sử dụng
  //dùng useEffect vì useEffect sẽ chạy sau khi mount lần đầu
  useEffect(() => {
    completedRef.current.style.visibility = "hidden";

    //fetch sẵn tts
    //   const context = new AudioContext();
    //   fetch("https://api.fpt.ai/hmi/tts/v5", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "api-key": "wluFDDV8bExklgwpEn6KFEKKvCkj3rpW",
    //       speed: "",
    //       voice: "banmai",
    //     },
    //     body: "Trọng tâm cơ thể của bạn hơi thấp",
    //   })
    //     .then((res) => res.json())
    //     .then((json) => {
    //       audioRef.current = new Audio(json.async);
    //     });
  }, []);

  const loadModel = async () => {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    const poseClassifier = await tf.loadLayersModel("./models/model.json");
    console.log("loadmodel");
    // interval = setInterval(() => {
    //     predictWebcam(detector, poseClassifier)
    // }, 100);

    requestRef.current = requestAnimationFrame(() => {
      predictWebcam(detector, poseClassifier);
    });
  };

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
    //ctx.drawImage(video, 0, 0);
    for (let i = 0; i < 17; i++) {
      const x = poses[0].keypoints[i].x;
      const y = poses[0].keypoints[i].y;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = colorStroke;
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
      ctx.lineWidth = 5;
      ctx.strokeStyle = colorStroke;
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

  const NO_CLASS = [
    "Chair",
    "Cobra",
    "Dog",
    "No_Pose",
    "Shoulderstand",
    "Traingle",
    "Tree",
    "Warrior",
  ];

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
  };

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
          return [keypoint.x, keypoint.y];
        });
        const processedInput = landmarks_to_embedding(input);
        const classification = poseClassifier.predict(processedInput);
        classification.array().then((data) => {
          const exerciseIndex = NO_CLASS.indexOf(exerciseName);
          //real

          setAccuracy(data[0][exerciseIndex]);
          if (data[0][exerciseIndex] > 0.97 && Boolean(flag.current) == false) {
            //chưa bắt đầu, tập đúng động tác
            colorStroke = "green";
            flag.current = true;
            startTimeRef.current = new Date();
          } else if (data[0][exerciseIndex] > 0.97 && flag.current == true) {
            //đã bắt đầu, tập đúng động tác
            if (countdownRef.current > 0) {
              countdownRef.current =
                countdownRef.current - (new Date() - startTimeRef.current);
              //countdownRef giống với countdown nhưng dùng để so sánh, nếu lớn hơn 0 thì mới trừ tiếp
              setCountdown(
                (prev) => prev - (new Date() - startTimeRef.current)
              );
              startTimeRef.current = new Date(); //very important
            } else {
              if ((completedRef.current.style.visibility = "hidden")) {
                completedRef.current.style.visibility = "visible";
                document.getElementById("completedAudio").play();
              }
            }
          } else if (data[0][exerciseIndex] <= 0.97 && flag.current == true) {
            //đã bắt đầu, tập sai động tác
            colorStroke = "gray";
            flag.current = false;
          }

          //Phát hướng dẫn bằng giọng nói
          if (
            data[0][exerciseIndex] > 0.85 &&
            data[0][exerciseIndex] <= 0.9 &&
            voiceRef.current == true &&
            new Date() - playTimeRef.current > 10000
          ) {
            //audioRef.current.play();
            const arrayVoice = document.getElementsByClassName("voice");
            const randomVoice =
              arrayVoice[Math.floor(Math.random() * arrayVoice.length)];
            randomVoice.play();
            playTimeRef.current = new Date();
          }

          //test
          for (let i = 0; i < 8; i++) {
            if (data[0][i] > 0.97) {
              //console.log(NO_CLASS[i]);
            }
          }
        });
      });
    }
    requestRef.current = requestAnimationFrame(() => {
      predictWebcam(detector, poseClassifier);
    });
  }

  return (
    <div className="yoga-container">
      <header className="yoga-header">
        <p>
          Tên động tác:
          <h2>{exerciseName}</h2>
        </p>
        <p>
          Đếm ngược:
          <h2>{Math.floor(countdown / 1000)} giây</h2>
        </p>
        <div className="completed" ref={completedRef}>
          Completed!
        </div>
        <p>
          Độ chính xác:
          {/* <h2>{Math.round(accuracy * 100)} %</h2> */}
          <CircularProgressWithLabel value={accuracy * 100} />
        </p>
      </header>
      <footer className="yoga-footer">
        <button
          className="run-btn"
          onClick={() => {
            loadModel();
          }}
        >
          RUN
        </button>
        <button
          className="tutorial-btn"
          onClick={() => {
            if (document.getElementById("myTutorial").style.display == "none") {
              document.getElementById("myTutorial").style.display = "block";
            } else {
              document.getElementById("myTutorial").style.display = "none";
            }
          }}
        >
          HƯỚNG DẪN
        </button>
        <button
          className="tutorial-btn"
          onClick={() => {
            voiceRef.current = !voiceRef.current;
          }}
        >
          VOICE AI
        </button>
        <div className="audio-controls">
          <PlayArrowIcon
            className="audio-icon"
            onClick={() => {
              document.getElementById("myAudio").play();
            }}
          />
          <PauseIcon
            className="audio-icon"
            onClick={() => {
              document.getElementById("myAudio").pause();
            }}
          />
        </div>
      </footer>
      <canvas ref={canvasRef} id="my-canvas" className="canvas"></canvas>
      <Webcam muted={false} id="webcam" ref={webcamRef} className="webcam" />
      <div className="media-container">
        <div className="tutorial-container" id="myTutorial">
          <h2 className="tutorial">Hướng dẫn:</h2>
          <iframe
            className="tutorial-iframe"
            width="100%"
            src={tutorialLink[exerciseName]}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div className="audio-container">
          <audio autoPlay="autoplay" id="myAudio">
            <source src="./yoga.mp3" />
          </audio>
          <audio id="completedAudio">
            <source src="./completed.mp3" />
          </audio>
          <audio className="voice">
            <source src="./voice1.mp3" />
          </audio>
          <audio className="voice">
            <source src="./voice2.mp3" />
          </audio>
          <audio className="voice">
            <source src="./voice3.mp3" />
          </audio>
        </div>
      </div>
    </div>
  );
};
export default YogaApp;
