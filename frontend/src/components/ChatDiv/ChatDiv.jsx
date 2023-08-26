import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const ChatDiv = () => {
  const [username, setUsername] = useState("");
  const { name } = useParams();
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  

  const [selectedUser, setSelectedUser] = useState(null); // Newly added state
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedUserMessages, setSelectedUserMessages] = useState([]);

  const [unreadMessages, setUnreadMessages] = useState({});
  

  useEffect(() => {
    const newSocket = io.connect("http://localhost:4000"); // Replace with your server URL
    setSocket(newSocket);
    setUsername(atob(name));

    newSocket.emit("join", { username: atob(name) });

    newSocket.on("message", (msg) => {
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      });

    return () => {
      newSocket.disconnect();
    };
  }, [name]);

    useEffect(() => {
    if (socket) {
        socket.on("users", (users) => {
            //remove the current user from the list of active users
            users = users.filter((user) => user.username !== username);

        setActiveUsers(users);
        });
    }

    return () => {
        if (socket) {
        socket.off("users");
        }
    };
    }, [socket]);

    useEffect(() => {
        if (selectedUser) {
          const userMessages = chatMessages.filter(
            (msg) =>
              (msg.from === username && msg.to === selectedUser.username) ||
              (msg.from === selectedUser.username && msg.to === username)
          );
          setSelectedUserMessages(userMessages);
        } else {
          setSelectedUserMessages(chatMessages);
        }
      }, [selectedUser, chatMessages,username]);


      useEffect(() => {
        if (socket) {
          socket.on("message", (msg) => {
            // Increment the unread message count for the sender and ignore if the sender is the selected user
            if (selectedUser && msg.from !== selectedUser.username) {
              setUnreadMessages((prevUnread) => ({
                ...prevUnread,
                [msg.from]: (prevUnread[msg.from] || 0) + 1,
              }));
            }

          });
        }
    
        return () => {
          if (socket) {
            socket.off("message");
          }
        };
      }, [socket]);


    const handleSendMessage = () => {
        if (selectedUser && message.trim() !== "") {
          const msgData = {
            from: username,
            to: selectedUser.username,
            message: message,
          };
          socket.emit("send_message", msgData);
          setChatMessages((prevMessages) => [...prevMessages, msgData]);
          setMessage("");
        }
      };

  return (
    <div>
      hello {username}
      <div style={{ display: "flex" }}>
        <div style={{ width: "20vw", height: "100vh" }}>
          <h1>Active Users</h1>
          <ul>
            {activeUsers.map((user, index) => (
              <li key={index} onClick={() => {setSelectedUser(user)
              
                setUnreadMessages((prevUnread) => ({
                  ...prevUnread,
                  [user.username]: 0,
                }));

              }}
              style={{ cursor: "pointer" }} >{user.username}{" "}
              {unreadMessages[user.username] > 0 && (
                <span>({unreadMessages[user.username]})</span>
              )}</li>
            ))}
          </ul>
        </div>

        <div style={{ width: "80vw", height: "100vh" }}>
        <h2>Chat with {selectedUser ? selectedUser.username : "Nobody"}</h2>
            <div>
              <ul>
                { selectedUser && selectedUserMessages.map((msg, index) => (
                  <li key={index}>
                    <strong>{msg.from}:</strong> {msg.message}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ChatDiv;
