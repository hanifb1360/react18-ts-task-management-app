import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { signIn } from '../features/userSlice';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    const { data: { user }, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Sign up failed', error);
      setError(error.message);
    } else {
      dispatch(signIn(user));
    }
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignUp;
