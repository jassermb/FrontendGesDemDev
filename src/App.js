// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FormDemandeDeveloppement from './component/form/form1';
import Login2 from './component/login2';
import ImageCarousel from './component/imagecarousel';
import NavBar from './component/user/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './App.css';
import Tableau2 from './component/user/tableau2'
import FormComponent from './component/form/form2'
import TaskFormComponent from './component/form/form3'
import DevelopmentRequestView from './component/coo/firsdem'
import DevelopmentRequestForm from './component/form/formDossier d’appro-Achat '
import Developmentpart1RequestDetails from './component/dem/part1form'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DevelopmentRequestDetails from'./component/dem/part2form'
import DevelopmentRequestDetailsView2 from './component/coo/seconddem'
import Firstdemchefprod from './component/chefprod/firstdemchefprod'
import EditDevelopmentRequest1 from './component/dem/updatefirstpart'
import EditDevelopmentRequest2 from './component/dem/updat2demdev'
import Demandepart3Details from './component/resachat/validationdemdev3'
import Modificationpart3Page from './component/dem/updat3demdev'
import Validation3DemandeCOO from './component/coo/thirdddem'
import Modificationpart3cooPage from './component/dem/cooreject2'
import AdminDashboard from './component/admin/admindashboard'
import RegisterForm from './component/admin/register'
import AdminSidebar from './component/admin/sidebaradmin'
import Alldetailsdemdev from './component/dem/alldetaills'
import Dashboardad from './component/admin/dashbord'
import Consulter1 from './component/consulter/consulter1'
import Consulterdd from './component/consulter/consulterd'
import Consulter3eme from './component/consulter/consulterdd'
import Form4coo from './component/coo/fourthdem'
import Form4 from './component/chefprod/form4'
import Consulterddd from './component/consulter/consulterddd'
const Layout = ({ children }) => (
  <>
    <NavBar />
    <div>{children}</div>
  </>
);
// const Layoutdmin = ({ children }) => (
//   <>
//     <AdminSidebar />
//     <div>{children}</div>
//   </>
// );

const App = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />

        <Route path="/Dashboardad" element={<Dashboardad />} />

        <Route path="/login" element={<Login2 />} />
        <Route path="/ImageCarousel" element={<Layout><ImageCarousel /></Layout>} />
        <Route path="/Tableau" element={<Layout><Tableau2 /></Layout>} />
        <Route path="/form1" element={<Layout><FormDemandeDeveloppement /></Layout>} />
        <Route path="/form2/:id" element={<Layout><FormComponent /></Layout>} />
        <Route path="/form2.5" element={<Layout><DevelopmentRequestForm /></Layout>} />
        <Route path="/form3/:id" element={<Layout><TaskFormComponent /></Layout>} />
        <Route path="/demdev1coo/:id" element={<Layout><DevelopmentRequestView /></Layout>} />
        <Route path="/demdev2coo/:id" element={<Layout><DevelopmentRequestDetails /></Layout>} />
        <Route path="/validationdem2/:id" element={<Layout><DevelopmentRequestDetailsView2 /></Layout>} />
        <Route path="/demdev1dem" element={<Layout><Developmentpart1RequestDetails /></Layout>} />
        <Route path="/validationdem1chefprod/:id" element={<Layout><Firstdemchefprod /></Layout>} />
        <Route path="/EditDevelopmentRequest/:id" element={<Layout><EditDevelopmentRequest1 /></Layout>} />
        <Route path="/EditDevelopmentRequest2/:id" element={<Layout><EditDevelopmentRequest2 /></Layout>} />
        <Route path="/Demandepart3Details/:id_demdev" element={<Layout><Demandepart3Details /></Layout>} />
        <Route path="/Modificationpart3Page/:id" element={<Layout><Modificationpart3Page /></Layout>} />
        <Route path="/Validation3DemandeCOO/:id_demdev" element={<Layout><Validation3DemandeCOO /></Layout>} />
        <Route path="/Modificationpart3cooPage/:id" element={<Layout><Modificationpart3cooPage /></Layout>} />
        <Route path="/Alldetailsdemdev/:id" element={<Layout><Alldetailsdemdev /></Layout>} />
        <Route path="/Consulter1/:id" element={<Layout><Consulter1 /></Layout>} />
        <Route path="/Consulter2/:id" element={<Layout><Consulterdd /></Layout>} />
        <Route path="/Consulter3/:id" element={<Layout><Consulter3eme /></Layout>} />
        <Route path="/Form4/:id" element={<Layout><Form4 /></Layout>} />
        <Route path="/Form4coo/:id" element={<Layout><Form4coo /></Layout>} />
        <Route path="/Consulterddd/:id" element={<Layout><Consulterddd /></Layout>} />





        <Route path="/NavBar" element={<NavBar />} />

      </Routes>
      <ToastContainer />

    </Router>
  );
};

export default App;
