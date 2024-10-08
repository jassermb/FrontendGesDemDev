import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Dropdown, Container, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, PersonCircle } from 'react-bootstrap-icons';
import io from 'socket.io-client';
import axios from 'axios';
import '../../css/NavBar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSignOutAlt } from 'react-icons/fa';
const SOCKET_SERVER_URL = 'http://localhost:5000';

// Function to format time ago
const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}  secondes`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}  minutes`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}  heures`;
  return `${Math.floor(diffInSeconds / 86400)} jours`;
};

// NavBar component
const NavBar = ({ userData, handleLogout }) => {

  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (userId && role) {
      const socket = io(SOCKET_SERVER_URL);
      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        socket.emit('register', { userId, role });
      });
      socket.on('send_notification', async (notification) => {
        if (notification.receiverRole === role) {
          const exists = await checkIdDemdevExists(notification);
          if (!exists) {
            setNotifications((prevNotifications) => [notification, ...prevNotifications]);
            toast.info(`New notification: ${notification.message}`);
          }
        }
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [role, userId]);

  useEffect(() => {


    if (role) {
      fetchNotifications();
    }
  }, [role]);

  const checkIdDemdevExists = async (notification) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/demdev/check-id-demdev/${notification.id_dem}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking id_demdev existence:', error);
      return false;
    }
  };
  const markNotificationAsRead = async (notificationId) => {
    try {
      console.log(notificationId);
      await axios.put(`http://localhost:5000/api/users/${notificationId}`);
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogoutClick = () => {
    if (typeof handleLogout === 'function') {
      handleLogout();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };
  const fetchNotifications = async () => {
    try {
      const apiUrl = `http://localhost:5000/api/users/notifications/${role}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    await markNotificationAsRead(notification.id);
    await fetchNotifications();
    if (role === 'chefdeproduit' && notification.type === 'Development Request part 1') {
      navigate(`/validationdem1chefprod/${notification.id_dem}`);
    } else if (role === 'chefdeproduit' && notification.type === 'Demande de Développement : Partie 1 Rejetée') {
      navigate(`/validationdem1chefprod/${notification.id_dem}`);
    } else if (role === 'coo' && notification.type === 'Development Request part 1') {
      navigate(`/demdev1coo/${notification.id_dem}`);
    } else if (role === 'coo' && notification.type === 'Demande de Développement : Partie 1 Rejetée') {
      navigate(`/demdev1coo/${notification.id_dem}`);
    } else if (role === 'coo' && notification.type === 'Development Request part 2') {
      navigate(`/validationdem2/${notification.id_dem}`);
    } else if (notification.role === 'coo' && notification.receiverRole === role && notification.type === 'validationcoo2') {
      navigate(`/form3/${notification.id_dem}`);
    } else if (notification.role === 'chefdeproduit' && notification.type === 'validationchefprod1') {
      navigate(`/demdev1coo/${notification.id_dem}`);
    } else if (notification.role === 'chefdeproduit' && notification.receiverRole === role && notification.type === 'rejetchefprod') {
      navigate(`/EditDevelopmentRequest/${notification.id_dem}`);
    } else if (role === 'coo' && notification.type === 'Demande de Développement : Partie 2 Rejetée') {
      navigate(`/validationdem2/${notification.id_dem}`);
    }//Development Request part 3
    else if (notification.role === 'coo' && notification.type === 'rejetcoo2') {
      navigate(`/EditDevelopmentRequest2/${notification.id_dem}`);
    } else if (notification.role === 'coo' && notification.type === 'rejetcoo2') {
      navigate(`/EditDevelopmentRequest2/${notification.id_dem}`);
    }
    else if (role === 'responsableachat' && notification.role === 'chefdeproduit' && notification.type === 'Development Request part 3') {
      navigate(`/Demandepart3Details/${notification.id_dem}`);
    }
    else if (role === 'coo' &&
      notification.role === 'responsableachat' && notification.type === 'validationresachat') {
      navigate(`/Validation3DemandeCOO/${notification.id_dem}`);
    }
    else if (role === 'chefdeproduit' &&
      notification.role === 'responsableachat' && notification.type === 'validationresachat') {
        navigate(`/Consulter3/${notification.id_dem}`);

    }
    else if (role === 'chefdeproduit' &&
      notification.role === 'responsableachat' && notification.type === 'rejetresachat') {
      navigate(`/Modificationpart3Page/${notification.id_dem}`);
    }
    else if (role === 'chefdeproduit' &&
      notification.role === 'coo' && notification.type === 'rejet2COO') {
      navigate(`/Modificationpart3cooPage/${notification.id_dem}`);
    }
    else if (role === 'chefdeproduit' &&
      notification.role === 'coo' && notification.type === 'validation2COO') {
      navigate(`/Form4/${notification.id_dem}`);
    }
    else if (role === 'coo' &&
      notification.role === 'chefdeproduit' && notification.type === 'Clôture chef produit') {
      navigate(`/Form4coo/${notification.id_dem}`);
    }
  };

  const formatMessage = (message) => {
    const words = message.split(' ');
    let formattedMessage = '';
    let currentLine = '';
    words.forEach((word) => {
      if ((currentLine + word).length <= 100) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        formattedMessage += (formattedMessage ? '\n' : '') + currentLine;
        currentLine = word;
      }
    });
    if (currentLine) {
      formattedMessage += (formattedMessage ? '\n' : '') + currentLine;
    }
    return formattedMessage;
  };

  return (
    <Navbar className="navbar-container" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/tableau">
          <img src="/img/logo.png" alt="Site Logo" className="navbar-logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Dropdown
              align="end"
              style={{ marginRight: "100px" }}
              show={showNotifications}
              onToggle={(isOpen) => setShowNotifications(isOpen)}
            >
              <Dropdown.Toggle
                id="dropdown-notifications"
                className="navbar-notification-toggle"
                style={{
                  color: 'white', fontWeight: 'bold', boxShadow: 'none', backgroundColor: 'transparent', filter: ' brightness(2.2)',

                }}
              >
                <Bell size={30} />
                {notifications.length > 0 && (
                  <Badge
                    className="navbar-notification-badge"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'black',
                      fontSize: '0.75rem',
                      border: '1px solid #C0C0C0',
                      padding: '2px 6px',
                      filter: ' brightness(1.8)',
                    }}
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="navbar-notification-menu"
                style={{
                  width: '450px',
                  padding: '0',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  marginTop: '5px',
                  border: '1px solid #959798',
                  borderTopRight: 'nun',
                  height: 'auto',
                  maxHeight: '300px',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                }}
              >  <Dropdown.Header className="navbar-notification-header" style={{ color: '#09193f', backgroundColor: '#F0F0F0', padding: '10px', borderBottom: '1px solid #000' }}>
                  Notifications
                </Dropdown.Header>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <Dropdown.Item
                      key={index}
                      className="navbar-notification-item"
                      onClick={() => handleNotificationClick(notification)}
                      style={{ padding: '8px', display: 'flex', flexDirection: 'column', borderBottom: '1.5px solid #959798', backgroundColor: '#fff', cursor: 'pointer' }}
                    >
                      <div className="notification-info" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="notification-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <div className="notification-type-group" style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                            <span className="notification-type" style={{ fontWeight: 'bold' }}>{notification.type}</span>
                          </div>
                          <Badge
                            style={{
                              backgroundColor: '#09193f',
                              fontSize: '0.75rem',
                              borderRadius: '12px',
                              color: '#F0F0F0',
                              padding: '5px 8px',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                              transition: 'background-color 0.3s ease',
                              cursor: 'pointer',
                            }}

                          >
                            {notification.status}
                          </Badge>
                        </div>
                        <span className="notification-code" style={{ fontStyle: 'italic', color: '#6c757d' }}>{notification.code}</span>
                        <small
                          className="notification-message"
                          style={{
                            color: '#212529',
                            marginBottom: '1px',
                            maxWidth: '300px',
                            overflowWrap: 'break-word',
                            display: 'block',
                            fontSize: '0.65rem',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {formatMessage(notification.message)}
                        </small>
                        <small className="notification-time" style={{ color: '#868e96', fontSize: '0.75rem' }}>{timeAgo(notification.createdAt)}</small>
                      </div>
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item style={{ textAlign: 'center', color: '#6c757d', padding: '10px' }}>Aucune nouvelle notification</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown align="end" >
              <Dropdown.Toggle
                id="dropdown-user"
                className="navbar-user-toggle"
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0', filter: ' brightness(2.2)'
                }}
              >
                {userData && userData.avatar ? (
                  <img
                    src={`http://localhost:3000/uploads/${userData.avatar}`}
                    alt="Avatar"
                    className="navbar-user-avatar rounded-circle"
                  />
                ) : (
                  <PersonCircle size={40} className="navbar-user-icon text-white" />
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="navbar-user-menu" style={{
                width: '100px', padding: '0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginTop: '15px'
              }}>
                <Dropdown.Item
                  className="navbar-dropdown-item"
                  onClick={handleLogoutClick}
                >
                  <FaSignOutAlt style={{ marginRight: '8px' }} />Se déconnecter
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ToastContainer />
    </Navbar>
  );
};

export default NavBar;
