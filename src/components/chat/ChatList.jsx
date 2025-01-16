import { useChat } from '../../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function ChatList() {
  const { selectUser, chatUsers, loading, unreadCounts, lastMessages } = useChat();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="w-full md:w-[320px] bg-white border-r-4 border-black h-screen">
        <div className="p-4 border-b-4 border-black">
          <h2 className="text-xl font-bold">Loading chats...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[320px] bg-white border-r-4 border-black h-screen">
      <div className="p-4 border-b-4 border-black flex items-center">
        <button 
          onClick={() => navigate('/home')}
          className="p-2 hover:bg-pink-50 rounded-full transition-colors mr-4"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-73px)]">
        {chatUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No chat matches yet
          </div>
        ) 
        :
        (
          chatUsers.map(user => (
            <div
              key={user.id}
              onClick={() => selectUser(user)}
              className="flex items-center p-4 border-b-2 border-gray-200 cursor-pointer hover:bg-pink-50"
            >
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold truncate">{user.name}</h3>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {lastMessages[user.id]?.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {lastMessages[user.id]?.message}
                  </p>
                  {unreadCounts[user.id] > 0 && (
                    <span className="ml-2 text-xs text-white bg-red-500 rounded-full px-2 py-1 whitespace-nowrap">
                      {unreadCounts[user.id]}
                    </span>
                  )}
                </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

export default ChatList;