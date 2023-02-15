import { HOST } from "../App";

const Login = () => {
  const handleLogin = () => {
    const usernameInput = document.querySelector(".username_input");
    const passwordInput = document.querySelector(".password_input");
    const data = {
      username: usernameInput.value,
      password: passwordInput.value,
    };
    fetch(`${HOST}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status == 200) {
        res.json().then((data) => {
          localStorage.setItem("accessToken", data.accessToken);
          alert("Đăng nhập thành công");
          window.location.replace("/");
        });
      } else {
        alert("Sai tên đăng nhập hoặc mật khẩu");
        window.location.reload();
      }
    });
  };

  return (
    <div className="login">
      <input placeholder="username" className="username_input"></input>
      <input placeholder="password" className="password_input"></input>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
