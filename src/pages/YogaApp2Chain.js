import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import Webcam from "react-webcam";
import { useRef, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, SvgIcon } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import './chain_style.css';

import { detector, poseClassifier } from "../App";
import "../assets/css/yoga.css";

//CIRCLE PROCESS
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import zIndex from "@mui/material/styles/zIndex";




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

const listExercisesName = [
  "Tree",
  "Chair",
  "Cobra",
  "Dog",
  "Shoulderstand",
  "Traingle",
  "Warrior"
];

const sampleObjects = {
  "Tree": [
    {
        "keypoints": [
            {
                "y": 72.03196048736572,
                "x": 424.62588691711426,
                "score": 0.8091042041778564,
                "name": "nose"
            },
            {
                "y": 64.9690318107605,
                "x": 430.671142578125,
                "score": 0.894550621509552,
                "name": "left_eye"
            },
            {
                "y": 65.2915620803833,
                "x": 414.9272766113281,
                "score": 0.8568142056465149,
                "name": "right_eye"
            },
            {
                "y": 70.83866357803345,
                "x": 438.9241352081299,
                "score": 0.890329897403717,
                "name": "left_ear"
            },
            {
                "y": 72.45401859283447,
                "x": 404.87504386901855,
                "score": 0.7882335186004639,
                "name": "right_ear"
            },
            {
                "y": 114.40486192703247,
                "x": 459.9100532531738,
                "score": 0.7200131416320801,
                "name": "left_shoulder"
            },
            {
                "y": 112.43011236190796,
                "x": 383.2480421066284,
                "score": 0.909952700138092,
                "name": "right_shoulder"
            },
            {
                "y": 177.9515790939331,
                "x": 477.17595481872564,
                "score": 0.6679749488830566,
                "name": "left_elbow"
            },
            {
                "y": 175.06339073181152,
                "x": 369.099081993103,
                "score": 0.7998969554901123,
                "name": "right_elbow"
            },
            {
                "y": 149.34961795806885,
                "x": 435.7148971557618,
                "score": 0.7595751881599426,
                "name": "left_wrist"
            },
            {
                "y": 148.1403923034668,
                "x": 415.81068897247314,
                "score": 0.6540475487709045,
                "name": "right_wrist"
            },
            {
                "y": 223.51929187774658,
                "x": 454.079517364502,
                "score": 0.9246522784233093,
                "name": "left_hip"
            },
            {
                "y": 228.22161197662354,
                "x": 408.95187282562256,
                "score": 0.8899399638175964,
                "name": "right_hip"
            },
            {
                "y": 262.6639652252197,
                "x": 526.0806217193604,
                "score": 0.7009806036949158,
                "name": "left_knee"
            },
            {
                "y": 311.5016269683838,
                "x": 423.4832372665405,
                "score": 0.7659391164779663,
                "name": "right_knee"
            },
            {
                "y": 257.3613739013672,
                "x": 440.8122959136963,
                "score": 0.6702132821083069,
                "name": "left_ankle"
            },
            {
                "y": 399.8912715911865,
                "x": 432.46423149108887,
                "score": 0.9087509512901306,
                "name": "right_ankle"
            }
        ],
        "score": 0.8006452427190893
    }
  ],
  "Chair": [
    {
        "keypoints": [
            {
                "y": 139.24859046936035,
                "x": 470.5589809417724,
                "score": 0.6807287931442261,
                "name": "nose"
            },
            {
                "y": 129.26576614379883,
                "x": 467.3133792877197,
                "score": 0.7078380584716797,
                "name": "left_eye"
            },
            {
                "y": 128.17575931549072,
                "x": 466.9362964630127,
                "score": 0.7217124700546265,
                "name": "right_eye"
            },
            {
                "y": 128.0339527130127,
                "x": 449.1252841949463,
                "score": 0.6751715540885925,
                "name": "left_ear"
            },
            {
                "y": 128.09828281402588,
                "x": 449.587739944458,
                "score": 0.6172396540641785,
                "name": "right_ear"
            },
            {
                "y": 148.20659637451172,
                "x": 437.8937377929687,
                "score": 0.800726056098938,
                "name": "left_shoulder"
            },
            {
                "y": 150.0469207763672,
                "x": 436.34523773193354,
                "score": 0.8616435527801514,
                "name": "right_shoulder"
            },
            {
                "y": 109.13320541381836,
                "x": 487.5379219055176,
                "score": 0.7145999073982239,
                "name": "left_elbow"
            },
            {
                "y": 109.79424476623535,
                "x": 486.4477291107177,
                "score": 0.790594220161438,
                "name": "right_elbow"
            },
            {
                "y": 66.43939018249512,
                "x": 517.8785552978516,
                "score": 0.8214476108551025,
                "name": "left_wrist"
            },
            {
                "y": 67.11768865585327,
                "x": 519.3241157531738,
                "score": 0.7270858883857727,
                "name": "right_wrist"
            },
            {
                "y": 239.55699920654297,
                "x": 367.77172470092773,
                "score": 0.7039597034454346,
                "name": "left_hip"
            },
            {
                "y": 240.1237392425537,
                "x": 365.3731575012207,
                "score": 0.8516328930854797,
                "name": "right_hip"
            },
            {
                "y": 314.78925704956055,
                "x": 435.23144149780273,
                "score": 0.7324361205101013,
                "name": "left_knee"
            },
            {
                "y": 314.1127109527588,
                "x": 435.8075942993164,
                "score": 0.7924054861068726,
                "name": "right_knee"
            },
            {
                "y": 399.5720386505127,
                "x": 402.14836025238037,
                "score": 0.7973790764808655,
                "name": "left_ankle"
            },
            {
                "y": 403.77405166625977,
                "x": 401.15266704559326,
                "score": 0.7496075630187988,
                "name": "right_ankle"
            }
        ],
        "score": 0.7497769769500283
    }
  ],
  "Cobra": [
    {
        "keypoints": [
            {
                "y": 270.84202766418457,
                "x": 566.3898315429688,
                "score": 0.7907153964042664,
                "name": "nose"
            },
            {
                "y": 262.5149345397949,
                "x": 561.2219944000244,
                "score": 0.5776215195655823,
                "name": "left_eye"
            },
            {
                "y": 262.10031509399414,
                "x": 560.8266010284424,
                "score": 0.6625251173973083,
                "name": "right_eye"
            },
            {
                "y": 266.56405448913574,
                "x": 539.4678058624266,
                "score": 0.8171862363815308,
                "name": "left_ear"
            },
            {
                "y": 266.46946907043457,
                "x": 536.2448348999025,
                "score": 0.9392155408859253,
                "name": "right_ear"
            },
            {
                "y": 309.25912857055664,
                "x": 523.8598957061768,
                "score": 0.873195469379425,
                "name": "left_shoulder"
            },
            {
                "y": 312.8231620788574,
                "x": 522.5047721862794,
                "score": 0.7121526598930359,
                "name": "right_shoulder"
            },
            {
                "y": 377.2734832763672,
                "x": 492.6948585510254,
                "score": 0.43608683347702026,
                "name": "left_elbow"
            },
            {
                "y": 385.7765865325928,
                "x": 482.23584556579596,
                "score": 0.7198303937911987,
                "name": "right_elbow"
            },
            {
                "y": 417.8747749328613,
                "x": 523.0267086029053,
                "score": 0.855685830116272,
                "name": "left_wrist"
            },
            {
                "y": 443.3485794067383,
                "x": 525.2712383270264,
                "score": 0.7714128494262695,
                "name": "right_wrist"
            },
            {
                "y": 400.0366687774658,
                "x": 465.442928314209,
                "score": 0.7419421672821045,
                "name": "left_hip"
            },
            {
                "y": 406.7434501647949,
                "x": 457.02748680114746,
                "score": 0.907662034034729,
                "name": "right_hip"
            },
            {
                "y": 420.397310256958,
                "x": 346.3176860809326,
                "score": 0.8373386263847351,
                "name": "left_knee"
            },
            {
                "y": 426.8781852722168,
                "x": 342.9534378051758,
                "score": 0.8412832021713257,
                "name": "right_knee"
            },
            {
                "y": 422.65528678894043,
                "x": 246.4811279773712,
                "score": 0.8378542065620422,
                "name": "left_ankle"
            },
            {
                "y": 426.69962882995605,
                "x": 237.27140212059024,
                "score": 0.7893593311309814,
                "name": "right_ankle"
            }
        ],
        "score": 0.7712392596637502
    }
  ],
  "Dog": [
    {
        "keypoints": [
            {
                "y": 309.8177719116211,
                "x": 460.17896080017084,
                "score": 0.7017588019371033,
                "name": "nose"
            },
            {
                "y": 312.94060707092285,
                "x": 471.15870857238764,
                "score": 0.5606895089149475,
                "name": "left_eye"
            },
            {
                "y": 312.5195503234863,
                "x": 471.15570449829096,
                "score": 0.533721923828125,
                "name": "right_eye"
            },
            {
                "y": 293.1764316558838,
                "x": 489.0617027282715,
                "score": 0.7554617524147034,
                "name": "left_ear"
            },
            {
                "y": 293.5872173309326,
                "x": 486.2854232788086,
                "score": 0.7532348036766052,
                "name": "right_ear"
            },
            {
                "y": 261.383056640625,
                "x": 479.46360015869146,
                "score": 0.7082511782646179,
                "name": "left_shoulder"
            },
            {
                "y": 257.70581245422363,
                "x": 482.0358314514161,
                "score": 0.7972041368484497,
                "name": "right_shoulder"
            },
            {
                "y": 328.5033702850342,
                "x": 513.260663986206,
                "score": 0.7853984236717224,
                "name": "left_elbow"
            },
            {
                "y": 330.8103847503662,
                "x": 515.119213104248,
                "score": 0.936306357383728,
                "name": "right_elbow"
            },
            {
                "y": 371.49696350097656,
                "x": 558.2543983459473,
                "score": 0.824309229850769,
                "name": "left_wrist"
            },
            {
                "y": 385.7769298553467,
                "x": 564.8558940887451,
                "score": 0.8203074336051941,
                "name": "right_wrist"
            },
            {
                "y": 167.92094707489014,
                "x": 385.8525314331055,
                "score": 0.838340699672699,
                "name": "left_hip"
            },
            {
                "y": 166.91139221191406,
                "x": 386.3650121688843,
                "score": 0.8381896018981934,
                "name": "right_hip"
            },
            {
                "y": 276.2392044067383,
                "x": 328.8453617095947,
                "score": 0.8861353397369385,
                "name": "left_knee"
            },
            {
                "y": 276.12545013427734,
                "x": 330.7771244049073,
                "score": 0.887147843837738,
                "name": "right_knee"
            },
            {
                "y": 365.5004596710205,
                "x": 281.08943128585815,
                "score": 0.8707959651947021,
                "name": "left_ankle"
            },
            {
                "y": 372.130651473999,
                "x": 274.1071834564209,
                "score": 0.8410971164703369,
                "name": "right_ankle"
            }
        ],
        "score": 0.784608830423916
    }
  ],
  "Shoulderstand": [
    {
        "keypoints": [
            {
                "y": 373.3450126647949,
                "x": 468.97609138488775,
                "score": 0.4240321218967438,
                "name": "nose"
            },
            {
                "y": 377.6333999633789,
                "x": 476.14933395385737,
                "score": 0.6652382016181946,
                "name": "left_eye"
            },
            {
                "y": 375.8082675933838,
                "x": 476.0237064361573,
                "score": 0.6238306760787964,
                "name": "right_eye"
            },
            {
                "y": 396.56956672668457,
                "x": 469.2393627166748,
                "score": 0.6832805275917053,
                "name": "left_ear"
            },
            {
                "y": 392.3045539855957,
                "x": 470.03240966796875,
                "score": 0.6205549240112305,
                "name": "right_ear"
            },
            {
                "y": 394.57305908203125,
                "x": 443.39860343933105,
                "score": 0.7186741828918457,
                "name": "left_shoulder"
            },
            {
                "y": 387.6155090332031,
                "x": 444.55751800537104,
                "score": 0.5595748424530029,
                "name": "right_shoulder"
            },
            {
                "y": 410.5438041687012,
                "x": 394.0532388687133,
                "score": 0.680519700050354,
                "name": "left_elbow"
            },
            {
                "y": 408.4166622161865,
                "x": 393.6459150314331,
                "score": 0.5809239149093628,
                "name": "right_elbow"
            },
            {
                "y": 367.4128532409668,
                "x": 395.7454481124878,
                "score": 0.5813249349594116,
                "name": "left_wrist"
            },
            {
                "y": 365.6209945678711,
                "x": 396.83931732177734,
                "score": 0.4736979901790619,
                "name": "right_wrist"
            },
            {
                "y": 332.18456268310547,
                "x": 407.14160346984863,
                "score": 0.25824201107025146,
                "name": "left_hip"
            },
            {
                "y": 343.9785861968994,
                "x": 410.7064952850342,
                "score": 0.16845442354679108,
                "name": "right_hip"
            },
            {
                "y": 246.1150074005127,
                "x": 426.5068378448486,
                "score": 0.6215953826904297,
                "name": "left_knee"
            },
            {
                "y": 246.41507148742676,
                "x": 424.18232822418213,
                "score": 0.7028762102127075,
                "name": "right_knee"
            },
            {
                "y": 177.7566432952881,
                "x": 431.2551631927491,
                "score": 0.6780496835708618,
                "name": "left_ankle"
            },
            {
                "y": 176.350679397583,
                "x": 432.2338619232178,
                "score": 0.6638007760047913,
                "name": "right_ankle"
            }
        ],
        "score": 0.596013505011797
    }
  ],
  "Traingle": [
    {
        "keypoints": [
            {
                "y": 198.05747509002686,
                "x": 527.173246383667,
                "score": 0.8277972936630249,
                "name": "nose"
            },
            {
                "y": 190.31338691711426,
                "x": 532.162670135498,
                "score": 0.8709222674369812,
                "name": "left_eye"
            },
            {
                "y": 185.78969478607178,
                "x": 530.8234252929688,
                "score": 0.7869499921798706,
                "name": "right_eye"
            },
            {
                "y": 178.2932710647583,
                "x": 517.5217571258545,
                "score": 0.8268839120864868,
                "name": "left_ear"
            },
            {
                "y": 169.80144023895264,
                "x": 510.7115211486817,
                "score": 0.7813334465026855,
                "name": "right_ear"
            },
            {
                "y": 232.56903648376465,
                "x": 492.33102226257324,
                "score": 0.7231696248054504,
                "name": "left_shoulder"
            },
            {
                "y": 158.3012866973877,
                "x": 462.9080905914307,
                "score": 0.5881810188293457,
                "name": "right_shoulder"
            },
            {
                "y": 299.6996212005615,
                "x": 488.37348365783697,
                "score": 0.8104081749916077,
                "name": "left_elbow"
            },
            {
                "y": 95.9734296798706,
                "x": 450.2906646728515,
                "score": 0.9238561987876892,
                "name": "right_elbow"
            },
            {
                "y": 351.0604763031006,
                "x": 494.7151699066162,
                "score": 0.7389206290245056,
                "name": "left_wrist"
            },
            {
                "y": 41.1036479473114,
                "x": 454.3504276275634,
                "score": 0.9010368585586548,
                "name": "right_wrist"
            },
            {
                "y": 254.83989715576172,
                "x": 405.03229999542236,
                "score": 0.8074528574943542,
                "name": "left_hip"
            },
            {
                "y": 234.78396892547607,
                "x": 371.00249195098877,
                "score": 0.8060368895530701,
                "name": "right_hip"
            },
            {
                "y": 323.85912895202637,
                "x": 454.46632766723627,
                "score": 0.9270323514938354,
                "name": "left_knee"
            },
            {
                "y": 313.3011245727539,
                "x": 316.91927337646484,
                "score": 0.9214056730270386,
                "name": "right_knee"
            },
            {
                "y": 403.50786209106445,
                "x": 511.8643417358399,
                "score": 0.8691325187683105,
                "name": "left_ankle"
            },
            {
                "y": 396.4512634277344,
                "x": 275.38068199157715,
                "score": 0.8392052054405212,
                "name": "right_ankle"
            }
        ],
        "score": 0.8205720536849078
    }
  ],
  "Warrior": [
    {
        "keypoints": [
            {
                "y": 245.9084129333496,
                "x": 306.55929470062256,
                "score": 0.6760068535804749,
                "name": "nose"
            },
            {
                "y": 238.76380920410156,
                "x": 302.5314679145813,
                "score": 0.7153491377830505,
                "name": "left_eye"
            },
            {
                "y": 239.50863361358643,
                "x": 302.3319902420044,
                "score": 0.7866851091384888,
                "name": "right_eye"
            },
            {
                "y": 220.87399005889893,
                "x": 313.47903633117676,
                "score": 0.7948037385940552,
                "name": "left_ear"
            },
            {
                "y": 223.49687576293945,
                "x": 310.4094877243042,
                "score": 0.7738028764724731,
                "name": "right_ear"
            },
            {
                "y": 215.3807830810547,
                "x": 342.0100727081299,
                "score": 0.750785231590271,
                "name": "left_shoulder"
            },
            {
                "y": 215.11023044586182,
                "x": 338.33244228363037,
                "score": 0.8755255341529846,
                "name": "right_shoulder"
            },
            {
                "y": 232.02120780944824,
                "x": 286.5838541984558,
                "score": 0.6192175149917603,
                "name": "left_elbow"
            },
            {
                "y": 227.6502513885498,
                "x": 284.9901714324951,
                "score": 0.7840946316719055,
                "name": "right_elbow"
            },
            {
                "y": 234.77455615997314,
                "x": 234.6130290031433,
                "score": 0.7035444974899292,
                "name": "left_wrist"
            },
            {
                "y": 234.59022045135498,
                "x": 238.06399130821225,
                "score": 0.8452064394950867,
                "name": "right_wrist"
            },
            {
                "y": 230.14384746551514,
                "x": 448.80004310607916,
                "score": 0.8682838082313538,
                "name": "left_hip"
            },
            {
                "y": 226.20845317840576,
                "x": 449.60647964477545,
                "score": 0.6684837341308594,
                "name": "right_hip"
            },
            {
                "y": 314.7608470916748,
                "x": 420.0287666320801,
                "score": 0.6109868884086609,
                "name": "left_knee"
            },
            {
                "y": 247.29683876037598,
                "x": 541.6498222351074,
                "score": 0.8627812266349792,
                "name": "right_knee"
            },
            {
                "y": 400.814208984375,
                "x": 423.25700187683105,
                "score": 0.9037577509880066,
                "name": "left_ankle"
            },
            {
                "y": 238.58327865600586,
                "x": 625.1389923095703,
                "score": 0.9197841882705688,
                "name": "right_ankle"
            }
        ],
        "score": 0.7740646565661711
    }
  ]
}

let degree3Points = [];

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

//MATH SUPPORT
//Vector AB từ 2 điểm A và B
const vector = (point1, point2) => {
  const x1 = point1.x;
  const y1 = point1.y;
  const x2 = point2.x;
  const y2 = point2.y;

  return {
    x: x2 - x1,
    y: y2 - y1
  };
};
//Độ dài vector AB
const distance = (vector) => {
  const x = vector.x;
  const y = vector.y;
  return Math.sqrt(x * x + y * y);
};
//Góc giữa 2 vector AB và CD
const degree2Vector = (vector1, vector2) => {
  const x1 = vector1.x;
  const y1 = vector1.y;
  const x2 = vector2.x;
  const y2 = vector2.y;
  
  return (
    (Math.acos(
      (x1 * x2 + y1 * y2) /
        (distance(vector1) * distance(vector2))
    ) *
      180) /
    Math.PI
  );
};
//Góc giữa 3 điểm
const degree3Point = (pointA, pointB, pointC) => {
  const vectorAB = vector(pointA, pointB);
  const vectorBC = vector(pointB, pointC);
  return degree2Vector(vectorAB, vectorBC);
};

const triplePoints = [
  [10, 8, 6], //góc khuỷu tay phải
  [8, 6, 5],
  [6, 5, 7],
  [5, 7, 9],  //góc khuỷu tay trái
  [8, 6, 12], //góc cánh tay phải
  [12, 6, 5],
  [7, 5, 11], //góc cánh tay trái
  [11, 5, 6],
  [6, 12, 1],
  [5, 11, 12],
  [6, 12, 14],  //góc hông đùi phải
  [5, 11, 13],  //góc hông đùi trái
  [14, 12, 11],
  [13, 11, 12],
  [12, 14, 16], //góc đầu gối phải
  [11, 13, 15]  //góc đầu gối trái
];

let colorStroke = "gray";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const YogaApp = () => {
  let query = useQuery();

  const [currentIndexExcercise, setCurrentIndexExcercise] = useState(0);
  const exerciseName = listExercisesName[currentIndexExcercise];

  const [countdown, setCountdown] = useState(20000);
  const countdownRef = useRef(20000);

  const [accuracy, setAccuracy] = useState(0);

  const levelRef = useRef("medium");

  const handleChangeLevel = () => {
    levelRef.current = document.getElementById("levelSelect").value;
  }

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

    //Thay doi sample image href
    if (exerciseName != "YourExercise"){
      const href = `./images/${exerciseName}.jpg`;
      document.getElementById("sampleImage").src = href;
    } else {
      document.getElementById("sampleImage").src = localStorage.getItem("fileBase64");
    }

    const sampleImage = document.getElementById("sampleImage");
    const samplePoses = sampleObjects[exerciseName];
    const sampleCanvas = document.getElementById("sampleCanvas");
    drawSampleImage(sampleCanvas, sampleImage, samplePoses);

    degree3Points = [];

    for (let i = 0; i < triplePoints.length; i++){
      const pointA = samplePoses[0].keypoints[triplePoints[i][0]];
      const pointB = samplePoses[0].keypoints[triplePoints[i][1]];
      const pointC = samplePoses[0].keypoints[triplePoints[i][2]];
      degree3Points.push(degree3Point(pointA, pointB, pointC));
    }

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
  }, [exerciseName]);

  const loadModel = async () => {
    await tf.ready(); // Chờ cho TensorFlow.js sẵn sàng
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );

    // interval = setInterval(() => {
    //     predictWebcam(detector, poseClassifier)
    // }, 100);

    //SAMPLE IMAGE

    const sampleImage = document.getElementById("sampleImage");
    const samplePoses = await detector.estimatePoses(sampleImage);
    const sampleCanvas = document.getElementById("sampleCanvas");
    drawSampleImage(sampleCanvas, sampleImage, samplePoses);

    degree3Points = [];

    for (let i = 0; i < triplePoints.length; i++){
      const pointA = samplePoses[0].keypoints[triplePoints[i][0]];
      const pointB = samplePoses[0].keypoints[triplePoints[i][1]];
      const pointC = samplePoses[0].keypoints[triplePoints[i][2]];
      degree3Points.push(degree3Point(pointA, pointB, pointC));
    }
    //console.log(degree3Points);
    

    //const sampleImage = document.getElementById("sampleImage");
    //const samplePoses = await detector.estimatePoses(sampleImage);
    //console.log(samplePoses);
    //const sampleCanvas = document.getElementById("sampleCanvas");
    //drawSampleImage(sampleCanvas, sampleImage, samplePoses);

    // const degree3Points = [];

    // for (let i = 0; i < triplePoints.length; i++){
    //   const pointA = samplePoses[0].keypoints[triplePoints[i][0]];
    //   const pointB = samplePoses[0].keypoints[triplePoints[i][1]];
    //   const pointC = samplePoses[0].keypoints[triplePoints[i][2]];
    //   degree3Points.push(degree3Point(pointA, pointB, pointC));
    // }
    // console.log(degree3Points);

    //TEST IMAGE
    /*
    const testImage = document.getElementById("testImage");
    const testPoses = await detector.estimatePoses(testImage);
    console.log(testPoses);
    const testCanvas = document.getElementById("testCanvas");

    const degree3PointsTest = [];

    for (let i = 0; i < triplePoints.length; i++){
      const pointA = testPoses[0].keypoints[triplePoints[i][0]];
      const pointB = testPoses[0].keypoints[triplePoints[i][1]];
      const pointC = testPoses[0].keypoints[triplePoints[i][2]];
      degree3PointsTest.push(degree3Point(pointA, pointB, pointC));
    }

    console.log(degree3PointsTest);
    const errorPoints = [];
    for (let i = 0; i < degree3Points.length; i++) {
      console.log(degree3PointsTest[i] - degree3Points[i]);
      if (Math.abs(degree3PointsTest[i] - degree3Points[i]) > 10){
        errorPoints.push(triplePoints[i][1]);
      }
    }
    console.log(errorPoints);

    drawTestImage(testCanvas, testImage, testPoses, errorPoints);
    */

    //TẠM ĐÓNG PREDICTWEBCAM
    const poseClassifier = await tf.loadLayersModel("./models/model.json");
    console.log("loadmodel");
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

  const drawTestImage = (canvas, image, poses, errorPoints) => {
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    for (let i = 0; i < 17; i++) {
      const x = poses[0].keypoints[i].x;
      const y = poses[0].keypoints[i].y;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "gray";
      ctx.strokeStyle = "gray";
      ctx.fill();
      ctx.stroke();

      //draw errorPoint
      if (errorPoints.includes(i)){
        //console.log(i);
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.strokeStyle = "red";
        ctx.stroke();
      }
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

  const drawSampleImage = (canvas, image, poses) => {
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    //ctx.drawImage(image, 0, 0);
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

  const draw = (canvas, video, poses, errorPoints) => {
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
      ctx.strokeStyle = "green";
      ctx.fillStyle = colorStroke;
      ctx.fill();
      ctx.stroke();

      //draw errorPoint
      if (errorPoints.includes(i)){
        //console.log(i);
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.strokeStyle = "red";
        ctx.stroke();
      }
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

  async function predictWebcam(detector, poseClassifier) {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {

      const video = webcamRef.current.video;
      //const video = document.getElementById("videoTreePose");
      video.style.transform = "rotateY(180deg)";
      const outputCanvas = canvasRef.current;
      outputCanvas.style.transform = "rotateY(180deg)";
      detector.estimatePoses(video).then((poses) => {
        //degree comparition
        const degree3PointsFrame = [];
        for (let i = 0; i < triplePoints.length; i++){
          const pointA = poses[0].keypoints[triplePoints[i][0]];
          const pointB = poses[0].keypoints[triplePoints[i][1]];
          const pointC = poses[0].keypoints[triplePoints[i][2]];
          degree3PointsFrame.push(degree3Point(pointA, pointB, pointC));
        }
        //console.log(degree3PointsFrame);
        const errorPoints = [];
        let levelOffsetDegree = 10;
        let levelAccuracy = 0.97;
        if (levelRef.current === "easy"){
          levelOffsetDegree = 15;
          levelAccuracy = 0.70;
        } else if (levelRef.current === "medium") {
          levelOffsetDegree = 13;
          levelAccuracy = 0.85;
        } else {
          levelOffsetDegree = 10;
          levelAccuracy = 0.90;
        }
        for (let i = 0; i < degree3Points.length; i++) {
          //console.log(degree3PointsFrame[i] - degree3Points[i]);
          if (Math.abs(degree3PointsFrame[i] - degree3Points[i]) > levelOffsetDegree){
            errorPoints.push(triplePoints[i][1]);
          }
        }
        //Độ chính xác bằng số điểm đúng / tổng số điểm (16)
        const accuracyFrame = (triplePoints.length-errorPoints.length)/triplePoints.length;
        setAccuracy(accuracyFrame);

        draw(outputCanvas, video, poses, errorPoints);

          //Đếm ngược
          if (accuracyFrame > levelAccuracy && Boolean(flag.current) == false) {
            //chưa bắt đầu, tập đúng động tác
            colorStroke = "green";
            flag.current = true;
            startTimeRef.current = new Date();
          } else if (accuracyFrame > levelAccuracy && flag.current == true) {
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
                setTimeout(() => {
                  completedRef.current.style.visibility = "hidden";
                  // Chuyển động tác
                  setCurrentIndexExcercise(Math.floor(Math.random()*listExercisesName.length))
                  console.log(exerciseName)
                  flag.current = false
                  setCountdown(20000)
                  colorStroke = "gray"
                  countdownRef.current = 20000
                  document.getElementById("sampleImage").classList.add("animation_move");
                  document.getElementById("sampleCanvas").classList.add("animation_move");
                  setTimeout(() => {
                    document.getElementById("sampleImage").classList.remove("animation_move");
                    document.getElementById("sampleCanvas").classList.remove("animation_move");
                  }, 5000)
                }, 1000)

                
              }
            }
          } else if (accuracyFrame<= levelAccuracy && flag.current == true) {
            //đã bắt đầu, tập sai động tác
            colorStroke = "gray";
            flag.current = false;
          }

          //Phát hướng dẫn bằng giọng nói
          if (
            accuracyFrame > 0.6 &&
            accuracyFrame <= levelAccuracy-0.1 &&
            voiceRef.current == true &&
            new Date() - playTimeRef.current > 10000
          ) {
            const arrayVoice = [];
            
            for (let i = 0; i < degree3Points.length; i++) {
              if (Math.abs(degree3PointsFrame[i] - degree3Points[i]) > 10){
                
              }
            }

            //hard code
            if ((degree3PointsFrame[3] - degree3Points[3] < -10) || (degree3PointsFrame[0] - degree3Points[0] < -10)) {
              arrayVoice.push(document.getElementById("voice1a"));
            }
            if ((degree3PointsFrame[3] - degree3Points[3] > 10) || (degree3PointsFrame[0] - degree3Points[0] > 10)) {
              arrayVoice.push(document.getElementById("voice1b"));
            }
            if ((degree3PointsFrame[6] - degree3Points[6] < -10) || (degree3PointsFrame[4] - degree3Points[4] < -10)) {
              arrayVoice.push(document.getElementById("voice2a"));
            }
            if ((degree3PointsFrame[6] - degree3Points[6] > 10) || (degree3PointsFrame[4] - degree3Points[4] > 10)) {
              arrayVoice.push(document.getElementById("voice2b"));
            }
            if ((degree3PointsFrame[11] - degree3Points[11] < -10) || (degree3PointsFrame[10] - degree3Points[10] < -10)) {
              arrayVoice.push(document.getElementById("voice3a"));
            }
            if ((degree3PointsFrame[11] - degree3Points[11] > 10) || (degree3PointsFrame[10] - degree3Points[10] > 10)) {
              arrayVoice.push(document.getElementById("voice3b"));
            }
            if ((degree3PointsFrame[15] - degree3Points[15] < -10) || (degree3PointsFrame[14] - degree3Points[14] < -10)) {
              arrayVoice.push(document.getElementById("voice4a"));
            }
            if ((degree3PointsFrame[15] - degree3Points[15] > 10) || (degree3PointsFrame[14] - degree3Points[14] > 10)) {
              arrayVoice.push(document.getElementById("voice4b"));
            }

            const randomVoice =
              arrayVoice[Math.floor(Math.random() * arrayVoice.length)];
            randomVoice.play();
            playTimeRef.current = new Date();
          }
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
          <h2>{Math.floor(countdownRef.current / 1000)} giây</h2>
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
      <select id="levelSelect" onChange={handleChangeLevel}>
            <option value="easy">DỄ</option>
            <option value="medium" selected="selected">VỪA</option>
            <option value="hard">KHÓ</option>
      </select>
      <canvas
        style={{zIndex:1005}}
        ref={canvasRef}
        id="my-canvas"
        className="canvas"
        // style={{ visibility: "hidden" }}
      ></canvas>
      <Webcam
        muted={false}
        id="webcam"
        ref={webcamRef}
        className="webcam"
        // style={{ visibility: "hidden" }}
      />
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

          <audio id="voice1a">
            <source src="./morongkhuyutay.mp3" />
          </audio>
          <audio id="voice1b">
            <source src="./thuhepkhuyutay.mp3" />
          </audio>
          <audio id="voice2a">
            <source src="./nangcanhtay.mp3" />
          </audio>
          <audio id="voice2b">
            <source src="./hacanhtay.mp3" />
          </audio>
          <audio id="voice3a">
            <source src="./giuduivathanxanhau.mp3" />
          </audio>
          <audio id="voice3b">
            <source src="./giuduivathansatnhau.mp3" />
          </audio>
          <audio id="voice4a">
            <source src="./duoithangchan.mp3" />
          </audio>
          <audio id="voice4b">
            <source src="./cochan.mp3" />
          </audio>
        </div>
      </div>
      <img src="./images/Tree.jpg" id="sampleImage" style={{"opacity": 1, "max-width": "100%", "max-height": "100%", "position": "absolute", "top": "100vh", "left": 0}}/>
      <canvas id="sampleCanvas" style={{"opacity": 1, "max-width": "100%", "max-height": "100%", "position": "absolute", "top": "100vh", "left": 0}}/>
      {/* <video controls id="videoTreePose" style={{zIndex: 999}} loop autoPlay>
        <source src="./videoTreePose.mp4" />
      </video> */}

      {/* <iframe
        src="https://codesandbox.io/embed/upload-widget-react-forked-8xjvyk?fontsize=14&hidenavigation=1&theme=dark"
        style={{
          width: "100%",
          height: "500px",
          border: 0,
          "border-radius": "4px",
          overflow: "hidden",
          "z-index": 2004,
        }}
        title="upload widget react (forked)"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      /> */}
    </div>
  );
};
export default YogaApp;
