import { useChat } from '../../context/ChatContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

function Chat() {
  const { selectedUser } = useChat();

  return (
    <div className="min-h-screen flex bg-pink-50">
      {/* Show ChatList when no user is selected on mobile */}
      <div className={`w-full md:w-auto ${selectedUser ? 'hidden md:block' : 'block'}`}>
        <ChatList />
      </div>
      
      {/* Show ChatWindow when user is selected on mobile */}
      <div className={`w-full md:flex-1 ${selectedUser ? 'block' : 'hidden md:block'}`}>
        <ChatWindow />
      </div>
    </div>
  );
}

export default Chat;