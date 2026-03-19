import { SignUp } from '@clerk/clerk-react';

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 hide-clerk-badge">
      <SignUp routing="path" path="/register" signInUrl="/login" forceRedirectUrl="/dashboard" />
    </div>
  );
};

export default Register;
