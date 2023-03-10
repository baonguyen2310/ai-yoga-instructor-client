import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from "react-router-dom";
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
];

const Exercise = (props) => {
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
