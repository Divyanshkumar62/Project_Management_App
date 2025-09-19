import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import { validateEmail } from "../../utils/Helper";
import PasswordInput from "../Input/PasswordInput";
import api from "../../services/api";

const LoginForm = () => {
  const { auth, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (auth.token) {
    return <Navigate to="/dashboard" replace />;
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

      // Save token to localStorage first so API calls work
      const tempUser = { email: formData.email };
      loginUser(token, tempUser);

      // Now fetch complete user data including avatarUrl
      const userResponse = await api.get('/users/me');
      const completeUserData = userResponse.data;

      // Update with complete user data
      loginUser(token, completeUserData);
      navigate("/dashboard");
    } catch (err) {
      console.error('Login process failed:', err);
      setError(`Invalid Credentials, please try again`);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm sm:max-w-md border-2 text-base sm:text-lg shadow-2xl mx-auto mt-8 sm:mt-20 p-6 sm:p-16 rounded-lg"
    >
      <h4 className="text-2xl sm:text-3xl mb-4 text-blue-700 font-medium text-center">
        Login
      </h4>
      <input
        type="text"
        name="email"
        placeholder="Email"
        className="w-full text-sm sm:text-md text-slate-500 bg-zinc-300 py-2 sm:py-3 mr-3 rounded-md outline-none border-[1.5px] px-3 sm:px-5 mb-4"
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
        className="btn-primary bg-blue-700 px-4 sm:px-6 py-2 rounded-md w-full sm:w-auto text-white text-center mt-2 hover:bg-blue-800 transition-colors"
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
