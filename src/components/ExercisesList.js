import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../assets/css/exercise.css";

// const listExercisesName = [
//   "Chair",
//   "Cobra",
//   "Dog",
//   "No_Pose",
//   "Shoulderstand",
//   "Traingle",
//   "Tree",
//   "Warrior",
// ];

const listExercisesName = [
  "Chair",
  "Cobra",
  "Dog",
  "Shoulderstand",
  "Traingle",
  "Tree",
  "Warrior",
  "YourExercise",
  "addYourExercise",
];

const getBase64 = (file) => {
  return new Promise((resolve,reject) => {
     const reader = new FileReader();
     reader.onload = () => resolve(reader.result);
     reader.onerror = error => reject(error);
     reader.readAsDataURL(file);
  });
}

const Exercise = (props) => {
  const handleAddYourExercise = () => {
    document.querySelector(".modal-add-your-exercise").style.display = "flex";
  };

  const handleSubmitYourExercise = () => {
    const imgInput = document.querySelector("#addYourExerciseInput");
    const [file] = imgInput.files;
    if (file) {
      document.querySelector(".your-exercise-img").src = URL.createObjectURL(file);
      getBase64(file).then(base64 => {
        localStorage["fileBase64"] = base64;
      })
    }
    document.querySelector(".exercise-name").innerHTML = document.querySelector("#your-exercise-name-input").value;
    document.querySelector(".exercise-name").style.color = "yellow";
    document.querySelector(".modal-add-your-exercise").style.display = "none";
  };

  useEffect(() => {
    document.querySelector(".modal-add-your-exercise").style.display = "none";
  }, []);

  if ((props.title != "addYourExercise") && (props.title != "YourExercise")) {
    const href = `./images/${props.title}.jpg`;
    return (
      // <Link className="exercise" to="/yoga" state={{ exerciseName: props.title }}>
      //   <div className="exercise-header">
      //     <h2>{props.title}</h2>
      //   </div>
      //   <img src={href} alt={props.title} className="exercise-img" />
      // </Link>
      <div>
        <div className="exercise-header">
          <h2>{props.title}</h2>
          <FavoriteIcon
            className="favorite-icon"
            onClick={(e) => {
              if (e.target.classList.contains("favorite")) {
                e.target.style.color = "#ccc";
                e.target.classList.remove("favorite");
              } else {
                e.target.style.color = "red";
                e.target.classList.add("favorite");
              }
            }}
          />
        </div>
        <Link className="exercise" to={`/yogaapp?name=${props.title}`}>
          <img src={href} alt={props.title} className="exercise-img" />
        </Link>
      </div>
    );
  } else if (props.title == "addYourExercise") {
    const href = `./images/addYourExercise.jpg`;
    return (
      <div>
        <div className="exercise-header">
          <h2>Đăng bài tập của bạn</h2>
          <FavoriteIcon
            className="favorite-icon"
            onClick={(e) => {
              if (e.target.classList.contains("favorite")) {
                e.target.style.color = "#ccc";
                e.target.classList.remove("favorite");
              } else {
                e.target.style.color = "red";
                e.target.classList.add("favorite");
              }
            }}
          />
        </div>
        <button className="add-your-exercise" onClick={handleAddYourExercise}>
          <img src={href} alt={props.title} className="exercise-img" />
        </button>
        <div className="modal-add-your-exercise">
            <input accept="image/*" type="file" id="addYourExerciseInput" onChange={(e) => {
              const imgInput = document.querySelector("#addYourExerciseInput");
              const [file] = imgInput.files;
              if (file) {
                document.querySelector("#add-your-exercise-img").src = URL.createObjectURL(file);
              }
            }}/>
            <img src="#" id="add-your-exercise-img" />
            <input placeHolder="Tên động tác của bạn" id="your-exercise-name-input"/>
            <button onClick={handleSubmitYourExercise} className="submit-your-exercise-btn">OK</button>
        </div>
      </div>
    );
  } else {
    const href = `./images/${props.title}.jpg`;
    return (
      <div>
        <div className="exercise-header">
          <h2 className="exercise-name">{props.title}</h2>
          <FavoriteIcon
            className="favorite-icon"
            onClick={(e) => {
              if (e.target.classList.contains("favorite")) {
                e.target.style.color = "#ccc";
                e.target.classList.remove("favorite");
              } else {
                e.target.style.color = "red";
                e.target.classList.add("favorite");
              }
            }}
          />
        </div>
        <Link className="exercise" to={`/yogaapp?name=${props.title}`}>
          <img src={href} alt={props.title} className="your-exercise-img" />
        </Link>
      </div>
    );
  }
};

const ExercisesList = () => {
  const listExercisesItem = listExercisesName.map((exerciseName, index) => {
    return (
      <li className="exercise-item" key={index}>
        <Exercise title={exerciseName} />
      </li>
    );
  });

  return (
    <div className="exercises-list-container">
      <div className="exercises-list-header">
        {/* <h1>Exercises List</h1> */}
      </div>
      <ul className="exercises-list">{listExercisesItem}</ul>
    </div>
  );
};

export default ExercisesList;
