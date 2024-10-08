import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Remplacez par l'URL de votre serveur

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Lors de la connexion du COO
    socket.emit('register_coo', { cooId: 'COO_ROOM' });

    // Écouter les notifications
    socket.on('notification', (message) => {
      setNotifications((prevNotifications) => [...prevNotifications, message]);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
