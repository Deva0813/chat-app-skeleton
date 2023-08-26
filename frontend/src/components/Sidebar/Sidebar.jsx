import {useState,useEffect} from 'react';
import io from 'socket.io-client';


const Sidebar = () => {
    const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState('room1');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io.connect('http://localhost:4000'); // Replace with your server URL
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  const handleSendMessage = () => {

    const msg = {
        user : "deva",
        message : message
    }

    if (message.trim() !== '') {
      socket.emit('sendMessage', { room, msg : msg });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room: {room}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.user +" : "+msg.message}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Sidebar;