import { HOST } from "../App";
import '../assets/css/user.css';

const Register = () => {
    const handleRegister = () => {
        const usernameInput = document.querySelector(".username_input");
        const passwordInput = document.querySelector(".password_input");
        const data = {
            username: usernameInput.value,
            password: passwordInput.value,
            ESPCODE: "yoga-ai"
        }
        fetch(`${HOST}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((res) => {
                if (res.status == 200) {
                    alert("Đăng ký thành công");
                    window.location.replace("/login");
                } else {
                    alert("Tên đăng nhập đã được sử dụng");
                    window.location.reload();
                }
            })
    }

    return (
        <div className="register">
            <p>Tài khoản:</p>
            <input placeholder="username" className="username_input"></input>
            <p>Mật khẩu:</p>
            <input placeholder="password" className="password_input"></input>
            <button onClick={handleRegister}>Đăng ký</button>
        </div>
    )
}

export default Register;