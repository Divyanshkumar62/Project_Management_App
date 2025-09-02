import React, { useContext, useState } from "react";
import PasswordInput from "../Input/PasswordInput";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/Helper";
import { signup } from "../../services/authService";

const SignupForm = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!validateEmail(formData.email)) {
        setError("Please Enter a valid Email address!");
        return;
      }
      const data = await signup(formData);
      console.log("Signup Response:", data);
      if (!data || !data.token) {
        setError("Signup failed! Please try again.");
        return;
      }
      const token = data.token;
      const user = { name: formData.name, email: formData.email };
      loginUser(token, user);
      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setError("Something went wrong, Please enter your details again!");
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="w-96 border-2 text-lg shadow-2xl mx-auto mt-20 p-16 rounded-lg"
    >
      <h4 className="text-3xl mb-4 text-blue-700 font-medium text-center">
        Signup
      </h4>
      <input
        type="text"
        placeholder="Name"
        name="name"
        className=" w-full text-md text-slate-500 bg-zinc-300 py-3 mr-3 rounded-md outline-none border-[1.5px] px-5 mb-4"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="email"
        placeholder="Email"
        className=" w-full text-md text-slate-500 bg-zinc-300 py-3 mr-3 rounded-md outline-none border-[1.5px] px-5 mb-4"
        value={formData.email}
        required
        onChange={handleChange}
      />
      <PasswordInput
        name={"password"}
        value={formData.password}
        onChange={handleChange}
        placeholder={"Enter password"}
      />
      <select
        name="role"
        className="w-full text-md text-slate-500 bg-zinc-300 py-3 mr-3 rounded-md outline-none border-[1.5px] px-5 mb-4"
        value={formData.role}
        required
        onChange={handleChange}
      >
        <option value="" disabled>
          Select role
        </option>
        <option value="manager">Manager</option>
        <option value="member">Member</option>
        <option value="owner">Owner</option>
      </select>
      {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
      <button
        type="submit"
        className="btn-primary bg-blue-700 px-2 py-2 rounded-md w-20 text-white text-center mt-2"
      >
        Signup
      </button>
      <p className="text-sm text-left mt-4 text-nowrap">
        Not registered yet?{" "}
        <Link to={"/login"} className="font-medium text-blue-700">
          Login to your account
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
