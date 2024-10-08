import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  handleSignOut: () => Promise<void>;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, handleSignOut }) => {
  const navigate = useNavigate();

  const handleSignOutClick = async () => {
    await handleSignOut();
    navigate('/login');
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center fixed w-full top-0 left-0 z-10 h-12">
      <div className="flex space-x-4">
        <button
          className={`py-2 px-4 ${activeTab === 'tasks' ? 'bg-gray-600' : ''}`}
          onClick={() => handleTabClick('tasks')}
        >
          Task List
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'add' ? 'bg-gray-600' : ''}`}
          onClick={() => handleTabClick('add')}
        >
          Add Task
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'categories' ? 'bg-gray-600' : ''}`}
          onClick={() => handleTabClick('categories')}
        >
          Manage Categories
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'lists' ? 'bg-gray-600' : ''}`}
          onClick={() => handleTabClick('lists')}
        >
          Manage Lists
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'profile' ? 'bg-gray-600' : ''}`}
          onClick={() => handleTabClick('profile')}
        >
          Profile
        </button>
      </div>
      <button
        className="text-red-500 hover:text-red-700"
        onClick={handleSignOutClick}
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;











