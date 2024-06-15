import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from 'axios';

function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
        },
        validateOnChange: true,
        validateOnBlur: true,
        validate: (values) => {
            let errors = {};

            if (values.username === "") {
                errors.username = "Please enter a valid username";
            }

            if (values.email === "") {
                errors.email = "Please enter a valid email";
            }

            if (values.password === "") {
                errors.password = "Please enter a valid password";
            }

            if (values.confirmpassword === "") {
                errors.confirmpassword = "Please enter a valid confirm password";
            } else if (values.password !== values.confirmpassword) {
                errors.confirmpassword = "Passwords do not match";
            }

            return errors;
        },
        onSubmit: async (values, actions) => {
            try {
                await axios.post('http://localhost:3002/register', values);
                navigate('/login');
                actions.resetForm();
            } catch (error) {
                console.error("Error submitting form:", error.message);
                alert(`Error: ${error.response?.data?.Message || error.message}`);
            }
        },
    });

    return (
        <>
            <div className="container">
                <div className="row justify-content-center align-items-center vh-100 w-100">
                    <div className="col-md-4">
                        <form className="px-4 py-3" onSubmit={formik.handleSubmit}>
                            <h3 className="text-center p-2">Register</h3>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="username"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="form-control"
                                    style={{
                                        borderColor:
                                            formik.touched.username && formik.errors.username && "red",
                                    }}
                                />
                                {formik.touched.username && formik.errors.username && (
                                    <span style={{ color: "red" }}>
                                        {formik.errors.username}
                                    </span>
                                )}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="form-control"
                                    style={{
                                        borderColor:
                                            formik.touched.email && formik.errors.email && "red",
                                    }}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <span style={{ color: "red" }}>
                                        {formik.errors.email}
                                    </span>
                                )}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="form-control"
                                    style={{
                                        borderColor:
                                            formik.touched.password && formik.errors.password && "red",
                                    }}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <span style={{ color: "red" }}>
                                        {formik.errors.password}
                                    </span>
                                )}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="confirmpassword"
                                    value={formik.values.confirmpassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="form-control"
                                    style={{
                                        borderColor:
                                            formik.touched.confirmpassword && formik.errors.confirmpassword && "red",
                                    }}
                                />
                                {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                                    <span style={{ color: "red" }}>
                                        {formik.errors.confirmpassword}
                                    </span>
                                )}
                            </div>

                            <div className="mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="dropdownCheck"
                                    />
                                    <label className="form-check-label" htmlFor="dropdownCheck">
                                        I agree to the terms & conditions
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Create User
                            </button>
                        </form>
                        <div className="text-center">
                            <div>Already registered? <Link to='/login'>Login</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
