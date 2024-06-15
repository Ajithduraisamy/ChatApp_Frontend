import { useFormik } from 'formik';
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      let errors = {};
      if (!values.email) {
        errors.email = 'Please enter a valid email';
      }
      if (!values.password) {
        errors.password = 'Please enter a valid password';
      }
      return errors;
    },
    onSubmit: async (values, actions) => {
      try {
        const response = await axios.post('https://chatapp-backend-09n7.onrender.com/login', values);
        const token = response.data.token;
        login(token);
        actions.resetForm();
        navigate('/chat');
      } catch (error) {
        console.error('Error submitting form:', error.message);
        alert(`Error: ${error.response?.data?.Message || error.message}`);
      }
    },
  });

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100 w-100">
        <div className="col-md-4">
          <form className="px-4 py-3" onSubmit={formik.handleSubmit}>
            <h3 className="text-center p-2">Login</h3>
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
                  borderColor: formik.touched.email && formik.errors.email ? 'red' : '',
                }}
              />
              {formik.touched.email && formik.errors.email && (
                <span style={{ color: 'red' }}>{formik.errors.email}</span>
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
                  borderColor: formik.touched.password && formik.errors.password ? 'red' : '',
                }}
              />
              {formik.touched.password && formik.errors.password && (
                <span style={{ color: 'red' }}>{formik.errors.password}</span>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          <div className="text-center">
            <div>
              New around here? <Link to="/register">Register</Link>
            </div>
            <div>Forgot password?</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
