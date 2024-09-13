import { Lock, Mail, User2Icon } from "lucide-react";
import { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/users/UserContext";

const Signup = () => {
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const { signupUser } = useContext(UserContext);

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    cpassword: "",
    form: "",
  });

  const [touched, setTouched] = useState({
    userName: false,
    email: false,
    password: false,
    cpassword: false,
  });

  const [isFormValid, setIsFormValid] = useState({
    userName: false,
    email: false,
    password: false,
    cpassword: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorTimeout, setErrorTimeout] = useState(null); // Timeout reference

  const navigate = useNavigate();

  const validateUserName = useCallback(() => {
    let userNameError = "";
    if (!data.userName.trim()) {
      userNameError = "Username is required.";
    } else if (data.userName.length < 6) {
      userNameError = "Username must be at least 6 characters long.";
    } else if (data.userName.length > 25) {
      userNameError = "Username must be less than 25 characters long.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, userName: userNameError }));
    setIsFormValid((prevIsValid) => ({ ...prevIsValid, userName: !userNameError }));
  }, [data.userName]);

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

  const validateConfirmPassword = useCallback(() => {
    let cpasswordError = "";
    if (data.password !== data.cpassword) {
      cpasswordError = "Passwords do not match.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, cpassword: cpasswordError }));
    setIsFormValid((prevIsValid) => ({ ...prevIsValid, cpassword: !cpasswordError }));
  }, [data.password, data.cpassword]);

  useEffect(() => {
    validateUserName();
  }, [data.userName, validateUserName]);

  useEffect(() => {
    if (isFormValid.userName) {
      validateEmail();
    }
  }, [data.email, isFormValid.userName, validateEmail]);

  useEffect(() => {
    if (isFormValid.userName && isFormValid.email) {
      validatePassword();
    }
  }, [data.password, isFormValid.userName, isFormValid.email, validatePassword]);

  useEffect(() => {
    if (isFormValid.userName && isFormValid.email && isFormValid.password) {
      validateConfirmPassword();
    }
  }, [data.cpassword, isFormValid.userName, isFormValid.email, isFormValid.password, validateConfirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous form error when the user attempts to submit the form again
    setErrors((prevErrors) => ({ ...prevErrors, form: "" }));

    if (isFormValid.userName && isFormValid.email && isFormValid.password && isFormValid.cpassword) {
      setIsSubmitting(true);
      const user = {
        username: data.userName,
        email: data.email,
        password: data.password,
      };

      // Clear any existing timeout
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }

      try {
        const result = await signupUser(user);
        if (result.success) {
          navigate('/');
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, form: result.message || "Signup failed. Please try again." }));
          setErrorTimeout(setTimeout(() => {
            setErrors((prevErrors) => ({ ...prevErrors, form: "" }));
          }, 5000)); // Clear error after 5 seconds
        }
      } catch (err) {
        console.error("Signup error:", err);
        setErrors((prevErrors) => ({ ...prevErrors, form: err.message || "Signup failed. Please try again." }));
        setErrorTimeout(setTimeout(() => {
          setErrors((prevErrors) => ({ ...prevErrors, form: "" }));
        }, 5000)); // Clear error after 5 seconds
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
      <div className="bg-slate-50 h-full rounded-2xl xl:w-2/3 sm:w-full flex">
        <div className="h-full bg-indigo-600 w-2/5 rounded-2xl py-12 px-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-200 font-semibold text-2xl">
              Welcome To <br /> Taskify
            </p>
            <p className="text-gray-300 text-sm font-semibold my-2 sm:text-xs">
              Create and manage your tasks with ease
            </p>
          </div>
        </div>
        <div className="h-full w-3/5 bg-slate-50 rounded-r-2xl py-8 lg:px-20 sm:px-8 space-y-3 flex flex-col items-center">
        {errors.form && (
                <div className="absolute top-24 text-red-500 text-lg font-bold text-center">
                  {errors.form}
                </div>
              )}
          <h1 className="text-center text-xl font-semibold text-indigo-600">SIGNUP</h1>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="userName" className="flex text-sm text-gray-600 font-semibold">
                <User2Icon className="mb-2 mr-2" /> Username
              </label>
              <input
                type="text"
                className={`border-2 border-solid rounded-md p-1 w-full text-gray-600 ${touched.userName && errors.userName ? 'border-red-600' : 'border-gray-500'}`}
                id="userName"
                name="userName"
                value={data.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                disabled={false}
              />
              {touched.userName && errors.userName && (
                <p className="text-red-600 text-xs">{errors.userName}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="flex text-sm text-gray-600 font-semibold">
                <Mail className="mb-2 mr-2" /> Email
              </label>
              <input
                type="email"
                className={`border-2 border-solid rounded-md p-1 w-full text-gray-600 ${touched.email && errors.email ? 'border-red-600' : 'border-gray-500'}`}
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John@email.com"
                disabled={!isFormValid.userName}
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
                className={`border-2 border-solid rounded-md p-1 w-full text-gray-600 ${touched.password && errors.password ? 'border-red-600' : 'border-gray-500'}`}
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="********"
                disabled={!isFormValid.userName || !isFormValid.email}
              />
              {touched.password && errors.password && (
                <p className="text-red-600 text-xs">{errors.password}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="cpassword" className="flex text-sm text-gray-600 font-semibold">
                <Lock className="mb-2 mr-2" /> Confirm Password
              </label>
              <input
                type="password"
                className={`border-2 border-solid rounded-md p-1 w-full text-gray-600 ${touched.cpassword && errors.cpassword ? 'border-red-600' : 'border-gray-500'}`}
                id="cpassword"
                name="cpassword"
                value={data.cpassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="********"
                disabled={!isFormValid.userName || !isFormValid.email || !isFormValid.password}
              />
              {touched.cpassword && errors.cpassword && (
                <p className="text-red-600 text-xs">{errors.cpassword}</p>
              )}
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className= {`bg-indigo-600 text-white p-2 rounded-md w-2/4 hover:bg-indigo-700 ${!isFormValid.userName || !isFormValid.email || !isFormValid.password || !isFormValid.cpassword || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}}
                disabled={!isFormValid.userName || !isFormValid.email || !isFormValid.password || !isFormValid.cpassword || isSubmitting`}
              >
                {isSubmitting ? "Signing In..." : "SignUp"}
              </button>
            </div>
          </form>
          <p className="text-gray-600">Already have an account? <Link to="/" className="font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-400">Login</Link></p>
        </div>
      </div>
  );
};

export default Signup;
