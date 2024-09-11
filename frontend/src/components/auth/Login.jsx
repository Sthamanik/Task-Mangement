import { Lock, Mail } from "lucide-react";
import { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/users/UserContext"; // Assuming this is used for login

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { loginUser } = useContext(UserContext); // Login user function from context

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [isFormValid, setIsFormValid] = useState({
    email: false,
    password: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState(null); // Timeout reference for form errors
  const navigate = useNavigate();

  // Validate email field
  const validateEmail = useCallback(() => {
    let emailError = "";
    const emailPattern = /^[a-zA-Z0-9_.+-]+@(gmail|hotmail|outlook)\.com$/;
    if (!data.email.trim()) {
      emailError = "Email is required.";
    } else if (!emailPattern.test(data.email)) {
      emailError = "Please enter a valid email.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));
    setIsFormValid((prevIsValid) => ({ ...prevIsValid, email: !emailError }));
  }, [data.email]);

  // Validate password field
  const validatePassword = useCallback(() => {
    let passwordError = "";
    if (!data.password.trim()) {
      passwordError = "Password is required.";
    } else if (data.password.length < 8) {
      passwordError = "Password must be at least 8 characters long.";
    } else if (data.password.length > 20) {
      passwordError = "Password must be less than 20 characters long.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, password: passwordError }));
    setIsFormValid((prevIsValid) => ({ ...prevIsValid, password: !passwordError }));
  }, [data.password]);

  useEffect(() => {
    validateEmail();
  }, [data.email, validateEmail]);

  useEffect(() => {
    if (isFormValid.email) {
      validatePassword();
    }
  }, [data.password, isFormValid.email, validatePassword]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  // Handle input blur (for touched state)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors((prevErrors) => ({ ...prevErrors, form: "" })); // Clear previous form error
    if (isFormValid.email && isFormValid.password) {
      setIsSubmitting(true);
      try {
        const result = await loginUser(data); // Assuming loginUser function is provided by context
        if (result.success) {
          navigate("/dashboard"); // Redirect to dashboard or desired route
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            form: result.message || "Login failed. Please try again.",
          }));
          setErrorTimeout(
            setTimeout(() => {
              setErrors((prevErrors) => ({ ...prevErrors, form: "" }));
            }, 5000)
          );
        }
      } catch (err) {
        console.error("Login error:", err);
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: err.message || "Login failed. Please try again.",
        }));
        setErrorTimeout(
          setTimeout(() => {
            setErrors((prevErrors) => ({ ...prevErrors, form: "" }));
          }, 5000)
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      {errors.form && (
        <div className="relative rounded-2xl w-2/3 p-2 text-white bg-red-500 text-lg font-bold text-center top-0">
          {errors.form}
        </div>
      )}
      <div className="bg-slate-50 h-full rounded-2xl xl:w-2/3 sm:w-full flex">
        <div className="h-full w-3/5 bg-slate-50 rounded-l-2xl py-8 lg:px-20 sm:px-8 space-y-3 flex flex-col items-center justify-center">
          <h1 className="text-center text-xl font-semibold text-indigo-600">
            LOGIN
          </h1>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="email" className="flex text-sm text-gray-600 font-semibold">
                <Mail className="mb-2 mr-2" /> Email
              </label>
              <input
                type="email"
                className={`border-2 border-solid rounded-md p-1 w-full text-gray-600 ${
                  touched.email && errors.email ? "border-red-600" : "border-gray-500"
                }`}
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John@email.com"
                disabled={isSubmitting}
              />
              {touched.email && errors.email && (
                <p className="text-red-600 text-xs">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="flex text-sm text-gray-600 font-semibold">
                <Lock className="mb-2 mr-2" /> Password
              </label>
              <input
                type="password"
                className={`border-2 border-solid rounded-md p-1 w-full text-gray-600 ${
                  touched.password && errors.password ? "border-red-600" : "border-gray-500"
                }`}
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {touched.password && errors.password && (
                <p className="text-red-600 text-xs">{errors.password}</p>
              )}
            </div>
            <div className="flex mt-4 items-end">
              <button
                type="submit"
                className={`bg-indigo-600 text-white p-2 rounded-md w-2/4 hover:bg-indigo-700 ${
                  isSubmitting || !isFormValid.email || !isFormValid.password ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isFormValid.email || !isFormValid.password || isSubmitting}
              >
                {isSubmitting ? "Logging In..." : "Login"}
              </button>
            </div>
          </form>
          <p>
            New to Taskify?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-400"
            >
              SignUp
            </Link>
          </p>
        </div>
        <div className="h-full bg-indigo-600 w-2/5 rounded-2xl py-12 px-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-200 font-semibold text-2xl">Welcome Back!!!</p>
            <p className="text-gray-300 text-sm font-semibold my-2 sm:text-xs">
              Create and manage your tasks with ease
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
