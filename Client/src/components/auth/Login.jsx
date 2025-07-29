import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../../features/auth/authSlice';
import FormField from '../ui/Form/FormField';
import LoadingSpinner from '../ui/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [generalError, setGeneralError] = useState('');
  
  const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required('Email is required'),
    password: yup.string().required('Password is required')
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setGeneralError(''); // Clear any previous errors
    
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      
      // Redirect to the originally requested page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      setGeneralError(error.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-neutral-600">
              Sign in to your Book Club account
            </p>
          </div>
        
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {generalError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{generalError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Email */}
              <FormField
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                register={register}
                errors={errors}
              />

              {/* Password */}
              <FormField
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                register={register}
                errors={errors}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full justify-center ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-neutral-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
