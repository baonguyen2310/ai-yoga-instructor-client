import Switch from "@mui/material/Switch";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { handleNotification } from "../features/handleNotification";
import { HOST } from "../App";
import ExercisesList from "../components/ExercisesList";
import "../assets/css/home.css";

const Home = () => {
  const [alarm, setAlarm] = useState(moment());
  const [checked, setChecked] = useState(false);

  const handleSwitch = () => {
    setChecked(!checked);
    const newChecked = !checked; //dùng biến tạm vì checked vẫn chưa chắc được set
    const data = {
      checked1: newChecked,
      alarm1: alarm.toDate(),
    };
    console.log(data);

    fetch(`${HOST}/alarm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(data),
    });
  };

  // Mục đích: Khi đặt giờ, thì tự động cho checked = true, và cập nhật giờ luôn
  // Nhưng: Người dùng chỉnh giờ thay đổi liên tục trong một lần
  // Nên: Khi đặt giờ, tự động cho checked = false để người dùng phải bấm checked thủ công
  const handleAlarm = (newValue) => {
    setAlarm(newValue);
    setChecked(false);
  };

  //get thông tin ban đầu nếu đã đăng nhập trước đó
  useEffect(() => {
    fetch(`${HOST}/alarm`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAlarm(moment(data.alarm1));
        setChecked(data.checked1);
      });
  }, []);

  return (
    <div className="Home">
      <nav className="navbar">
        <img src="./logo.png" alt="" className="logo-img" />
        <div className="navlist">
          <button className="notify-btn" onClick={(e) => handleNotification(e)}>
            <NotificationsIcon className="notify-icon" />
          </button>
          <Link to="/register" className="register-link">
            <button className="register-btn">Đăng ký</button>
          </Link>
          <Link to="/login" className="login-link">
            <button className="login-btn">Đăng nhập</button>
          </Link>
        </div>
      </nav>
      <div className="alarms-container">
        <h2>Hẹn giờ tập</h2>
        <div className="alarms">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
              label="Hẹn giờ tập"
              value={alarm}
              onChange={(newValue) => handleAlarm(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Switch
            className="alarm-switch"
            checked={checked}
            onChange={handleSwitch}
          />
        </div>
      </div>
      <ExercisesList />
    </div>
  );
};

export default Home;
