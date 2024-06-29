import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './app/store';
import { fetchUser } from './features/userSlice';
import { fetchTasks } from './features/tasksSlice';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    console.log("Fetching user...");
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      console.log("User authenticated, fetching tasks...");
      dispatch(fetchTasks());
    } else {
      console.log("User not authenticated");
    }
  }, [user, dispatch]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'user/signOut' });
  };

  console.log("User state in App component:", user);

  return (
    <div className="App">
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <AddTask />
          <TaskList />
        </>
      ) : (
        <>
          <SignIn />
          <SignUp />
        </>
      )}
    </div>
  );
};

export default App;
