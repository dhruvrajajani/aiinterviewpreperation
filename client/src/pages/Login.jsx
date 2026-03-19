import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 hide-clerk-badge">
      <SignIn routing="path" path="/login" signUpUrl="/register" forceRedirectUrl="/dashboard" />
    </div>
  );
};

export default Login;
