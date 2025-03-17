import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import { validateEmail } from "../../utils/Helper";
import PasswordInput from "../Input/PasswordInput";

const LoginForm = () => {
  const { auth, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (auth.token) {
    Navigate("/home");
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!validateEmail(formData.email)) {
        setError("Please Enter a valid Email address");
        return;
      }
      const data = await login(formData);
      const token = data.token;
      const user = { email: formData.email };
      loginUser(token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(`Invalid Credentials, please try again`);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-96 border-2 text-lg shadow-2xl mx-auto mt-20 p-16 rounded-lg"
    >
      <h4 className="text-3xl mb-4 text-blue-700 font-medium text-center">
        Login
      </h4>
      <input
        type="text"
        name="email"
        placeholder="Email"
        className=" w-full text-md text-slate-500 bg-zinc-300 py-3 mr-3 rounded-md outline-none border-[1.5px] px-5 mb-4"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <PasswordInput
        name={"password"}
        value={formData.password}
        onChange={handleChange}
        placeholder={"Enter password"}
      />
      {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
      <button
        type="submit"
        className="btn-primary bg-blue-700 px-2 py-2 rounded-md w-20 text-white text-center mt-2"
      >
        Login
      </button>
      <p className="text-sm text-center mt-4">
        Not registered yet?{" "}
        <Link to={"/signup"} className="font-medium text-blue-700">
          Create an account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
