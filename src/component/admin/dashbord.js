// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import '../../css/dash.css';

const Dashboardad = () => {
  const [active, setActive] = useState(false);

  // Equivalent to handling hover logic in vanilla JS
  useEffect(() => {
    const listItems = document.querySelectorAll(".navigation li");

    function activeLink() {
      listItems.forEach((item) => {
        item.classList.remove("hovered");
      });
      this.classList.add("hovered");
    }

    listItems.forEach((item) => item.addEventListener("mouseover", activeLink));

    // Cleanup event listeners when component unmounts
    return () => {
      listItems.forEach((item) => item.removeEventListener("mouseover", activeLink));
    };
  }, []);

  const toggleMenu = () => {
    setActive(!active);
  };

  return (
    <div className={`container ${active ? "active" : ""}`}>
      {/* Navigation Section */}
      <div className={`navigation ${active ? "active" : ""}`} > 
        <ul style={{marginLeft:'-30px'}}>
          <li>
            <a href="#" >
              <span className="icon">
                <ion-icon name="logo-apple"></ion-icon>
              </span>
              <span className="title">Brand Name</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon">
                <ion-icon name="home-outline"></ion-icon>
              </span>
              <span className="title">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon">
                <ion-icon name="people-outline"></ion-icon>
              </span>
              <span className="title">Customers</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon">
                <ion-icon name="chatbubble-outline"></ion-icon>
              </span>
              <span className="title">Messages</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon">
                <ion-icon name="help-outline"></ion-icon>
              </span>
              <span className="title">Help</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon">
                <ion-icon name="settings-outline"></ion-icon>
              </span>
              <span className="title">Settings</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon">
                <ion-icon name="lock-closed-outline"></ion-icon>
              </span>
              <span className="title">Password</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon">
                <ion-icon name="log-out-outline"></ion-icon>
              </span>
              <span className="title">Sign Out</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Main Section */}
      <div className={`main ${active ? "active" : ""}`} style={{width:'100%'}}>
        <div className="topbar">
          <div className="toggle" onClick={toggleMenu}>
            <ion-icon name="menu-outline"></ion-icon>
          </div>
          <div className="search">
            <label>
              <input type="text" placeholder="Search here" />
              <ion-icon name="search-outline"></ion-icon>
            </label>
          </div>
          <div className="user">
            <img src="assets/imgs/customer01.jpg" alt="User" />
          </div>
        </div>

        {/* Cards Section */}
        <div className="cardBox">
          <div className="card">
            <div>
              <div className="numbers">1,504</div>
              <div className="cardName">Daily Views</div>
            </div>
            <div className="iconBx">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
          </div>
          <div className="card">
            <div>
              <div className="numbers">80</div>
              <div className="cardName">Sales</div>
            </div>
            <div className="iconBx">
              <ion-icon name="cart-outline"></ion-icon>
            </div>
          </div>
          <div className="card">
            <div>
              <div className="numbers">284</div>
              <div className="cardName">Comments</div>
            </div>
            <div className="iconBx">
              <ion-icon name="chatbubbles-outline"></ion-icon>
            </div>
          </div>
          <div className="card">
            <div>
              <div className="numbers">$7,842</div>
              <div className="cardName">Earning</div>
            </div>
            <div className="iconBx">
              <ion-icon name="cash-outline"></ion-icon>
            </div>
          </div>
        </div>

        {/* Recent Orders and Recent Customers */}
        <div className="details">
          <div className="recentOrders">
            <div className="cardHeader">
              <h2>Recent Orders</h2>
              <a href="#" className="btn">View All</a>
            </div>
            <table>
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Price</td>
                  <td>Payment</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Star Refrigerator</td>
                  <td>$1200</td>
                  <td>Paid</td>
                  <td><span className="status delivered">Delivered</span></td>
                </tr>
                <tr>
                  <td>Dell Laptop</td>
                  <td>$110</td>
                  <td>Due</td>
                  <td><span className="status pending">Pending</span></td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>

          <div className="recentCustomers">
            <div className="cardHeader">
              <h2>Recent Customers</h2>
            </div>
            <table>
              <tr>
                <td width="60px">
                  <div className="imgBx"><img src="assets/imgs/customer02.jpg" alt="Customer" /></div>
                </td>
                <td>
                  <h4>David <br /> <span>Italy</span></h4>
                </td>
              </tr>
              <tr>
                <td width="60px">
                  <div className="imgBx"><img src="assets/imgs/customer01.jpg" alt="Customer" /></div>
                </td>
                <td>
                  <h4>Amit <br /> <span>India</span></h4>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardad;
