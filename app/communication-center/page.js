"use client"; 

import { useState } from "react";
import Link from "next/link";

export default function CommunicationCenter() {
  const [activeUsers] = useState([
    "John Doe",
    "Jane Smith",
    "Alex Johnson",
    "Maria Garcia",
  ]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Admin",
      text: "Team meeting at 3 PM today. Be prepared!",
    },
    { id: 2, sender: "John Doe", text: "Got it, Admin!" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [privateMessages, setPrivateMessages] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState("");

  // Send a message to the board
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "You", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  // Send private message
  const handleSendPrivateMessage = (receiver) => {
    if (privateMessages[receiver] && privateMessages[receiver].trim()) {
      setPrivateMessages({ ...privateMessages, [receiver]: "" });
    }
  };

  // Send broadcast notification
  const handleSendBroadcast = () => {
    if (notification.trim()) {
      alert(`Broadcast sent: ${notification}`);
      setNotification("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Section */}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-[#003366] mb-6">
          Communication Center
        </h2>

        {/* Broadcast Notification Section */}
        <div className="mb-12 p-6 bg-[#e1effd] rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#003366] mb-4">
            Send Broadcast Notification
          </h3>
          <textarea
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-4"
            rows="4"
            placeholder="Enter notification message..."
          />
          <button
            onClick={handleSendBroadcast}
            className="bg-[#003366] text-white px-6 py-3 rounded-lg hover:bg-[#002244]"
          >
            Send Broadcast
          </button>
        </div>

        {/* Message Board Section */}
        <div className="mb-12 p-6 bg-[#e1effd] rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#003366] mb-4">
            Message Board
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-4">
                <span className="font-semibold text-[#003366]">
                  {msg.sender}:
                </span>
                <p className="text-gray-600">{msg.text}</p>
              </div>
            ))}
          </div>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-4"
            rows="4"
            placeholder="Post a message to the board..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#003366] text-white px-6 py-3 rounded-lg hover:bg-[#002244]"
          >
            Send Message
          </button>
        </div>

        {/* Private Messaging Section */}
        <div className="mb-12 p-6 bg-[#e1effd] rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#003366] mb-4">
            Private Messaging
          </h3>
          <div className="flex space-x-4 mb-6">
            {activeUsers.map((user) => (
              <button
                key={user}
                onClick={() => setSelectedUser(user)}
                className={`px-4 py-2 rounded-lg ${
                  selectedUser === user
                    ? "bg-[#003366] text-white"
                    : "bg-gray-200"
                }`}
              >
                {user}
              </button>
            ))}
          </div>
          {selectedUser && (
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                {privateMessages[selectedUser] && (
                  <div>
                    <span className="font-semibold text-[#003366]">You:</span>
                    <p className="text-gray-600">
                      {privateMessages[selectedUser]}
                    </p>
                  </div>
                )}
                <textarea
                  value={privateMessages[selectedUser] || ""}
                  onChange={(e) =>
                    setPrivateMessages({
                      ...privateMessages,
                      [selectedUser]: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-4"
                  rows="4"
                  placeholder={`Message ${selectedUser}...`}
                />
                <button
                  onClick={() => handleSendPrivateMessage(selectedUser)}
                  className="bg-[#003366] text-white px-6 py-3 rounded-lg hover:bg-[#002244]"
                >
                  Send Private Message
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Users Section */}
        <div className="p-6 bg-[#e1effd] rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#003366] mb-4">
            Active Users
          </h3>
          <ul className="list-none space-y-2">
            {activeUsers.map((user, index) => (
              <li key={index} className="text-gray-600">
                {user}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
