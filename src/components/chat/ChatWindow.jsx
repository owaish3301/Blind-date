import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function ChatWindow() {
  const { selectedUser, chats, sendMessage, deselectUser } = useChat();
  const [message, setMessage] = useState('');

  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center h-screen">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 border-b-4 border-black flex items-center bg-white">
        <button 
          onClick={deselectUser} 
          className="md:hidden mr-4 p-2 hover:bg-pink-50 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-12 h-12 rounded-full mr-4" />
        <h2 className="text-xl font-bold">{selectedUser.name}</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {chats.map(chat => (
          <div key={chat.id} className={`flex ${chat.userId === '1' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs p-3 rounded-lg border-2 ${chat.userId === '1' ? 'bg-pink-200 border-pink-400' : 'bg-white border-black'}`}>
              <p className="text-sm">{chat.message}</p>
              <p className="text-xs text-gray-500 mt-1">{chat.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t-4 border-black flex items-center space-x-4 bg-white">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-3 border-2 border-black rounded bg-pink-50"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="px-6 py-3 bg-pink-500 text-white font-bold rounded border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0_0_#000] transition-all duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;