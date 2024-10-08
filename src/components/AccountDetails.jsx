import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import NavigationBar from "./NavBar";
import { Button, Card, Container, Modal, Form } from "react-bootstrap";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../features/shoppingCartSlice";

const AccountDetails = () => {
  //User context
  const { user, setUser } = useContext(UserContext);

  // This will hold the customer to  
  const [customer, setCustomer] = useState({});
  const [account, setAccount] = useState({});

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //MOdal Control
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  
  // Hook set up
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // initial customer information fetch to display info on the screen
  const fetchCustomer = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      console.log("Error fetching Customer:", error);
    }
  };

  const fetchAccount = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/customeraccounts/${id}`
      );
      setAccount(response.data);
    } catch (error) {
      console.log("Error fetching Account:", error);
    }
  };

  useEffect(() => {
    fetchCustomer(user.customer_id);
    fetchAccount(user.account_id);
  }, []);

  //


  // Handle Modal Control for the edit options
  const handleEditCustomer = () => setShowEditCustomerModal(true);
  const handleCloseEditCustomer = () => setShowEditCustomerModal(false);

  const handleEditAccount = () => setShowEditAccountModal(true);
  const handleCloseEditAccount = () => setShowEditAccountModal(false);

  

  // Customer Submit handles the update of the customer information
  const handleCustomerSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.put(`http://127.0.0.1:5000/customers/${user.customer_id}`, {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
        });
        console.log('Customer updated successfully:', response.data);

        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        handleCloseEditCustomer();
    } catch (error) {
        console.error('There was an error updating the customer!', error);
    }
};

// Account Submit handles the update of the account information
const handleAccountSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.put(`http://127.0.0.1:5000/customeraccounts/${user.account_id}`, {
            username: username,
            password: password,
            customer_id: user.customer_id
        });
        console.log('Customer account updated successfully:', response.data);

        setUsername('');
        setPassword('');
        setCustomerId('');
        handleCloseEditAccount();
    } catch (error) {
        console.error('There was an error updating the customer account!', error);
    }
};

 
// Delete customer function to delete the customer and account
// Also sets the context to empty and clears the session storage and cart and navigates to the home page
  const deleteCustomer = async (customer_id) => {
    console.log(`Deleting customer ${customer_id}...`);
    const confirmed = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmed) return;
    try {
      await axios.delete(`http://127.0.0.1:5000/customers/${customer_id}`)
      console.log(`Customer ${customer_id} deleted successfully`);
      sessionStorage.clear();
      setUser({
        username: "",
        customer_id: "",
        account_id: "",
        isLoggedIn: false,
      });
      sessionStorage.removeItem("user");
      dispatch(clearCart())
      navigate("/", {replace: true});
    } catch (error) {
      console.log(`Error deleting customer ${customer_id}:`, error);
    }
  }


  return (
    <>
      <NavigationBar />
      <Container className="d-flex justify-content-center mt-5">
        <Card >
          <Card.Body>
            <Card.Title className="text-center">Account Details</Card.Title>
            <Card.Text>
            <p>
                <strong>ID:</strong> {customer?.customer_id}
              </p>
              <p>
                <strong>Name:</strong> {customer?.name}
              </p>
              <p>
                <strong>Email:</strong> {customer?.email}
              </p>
              <p>
                <strong>Phone:</strong> {customer?.phone}
              </p>
              <p>
                <strong>Username:</strong> {account?.username}
              </p>
            </Card.Text>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between">
            <Button className="p-2 m-2" variant="primary" onClick={handleEditCustomer}>
              Edit Customer
            </Button>
            <Button className="p-2 m-2" variant="secondary" onClick={handleEditAccount}>
              Edit Account
            </Button>
            <Button className="p-2 m-2" variant="outline-danger" onClick={() => deleteCustomer(customer.customer_id)}>
              Delete Account
            </Button>
          </Card.Footer>
        </Card>

        {/* Edit Customer Modal */}
        <Modal
          show={showEditCustomerModal}
          onHide={handleCloseEditCustomer}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCustomerSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={customer.name ? customer.name : "Enter name"}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={customer.email ? customer.email : "Enter Email"}
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={customer.phone ? customer.phone : "Enter #"}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Account Modal */}
        <Modal
          show={showEditAccountModal}
          onHide={handleCloseEditAccount}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAccountSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={account.username ? account.username : "Enter Username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    <Footer />  
    </>
  );
};

export default AccountDetails;
