import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Nav, Button, Badge, Tab } from "react-bootstrap";
import CourseCard from "./CourseCard";
import MetamaskError from "./MetamaskError";
import InfoPanel from "./infopanel";
import "../styles/Student.css";

const axios = require("axios");

export const Student = ({ address, contract, t_contract, ts_contract }) => {
  const tokenPrice = 100000000000000;
  const { id } = useContext(UserContext);
  const [name, setName] = useState("");
  const [tokens, setTokens] = useState(0);
  const [balance, setBalance] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [results, setResults] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [allCoursesLoading, setAllCoursesLoading] = useState(false);
  const [purchasingTokens, setPurchasingTokens] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await getCourses();
        await getAllAvailableCourses();
        await getBalance();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getAllAvailableCourses = async () => {
    setAllCoursesLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/courses/all", {}, { headers: { "Content-Type": "application/json" } });
      if (res.data !== undefined) setAllCourses(res.data);
    } catch (err) {
      console.error("Error fetching all courses:", err);
    } finally {
      setAllCoursesLoading(false);
    }
  };
  const getCourses = async () => {
    setCoursesLoading(true);
    try {
      if (contract !== undefined && id.id !== null) {
        const res = await contract.methods.getStudent(id.id).call();
        if (res != null && (res[4] != null && res[4][0] != null)) {
          setName(res[1]);
          setDeadline(res[5]);
          const coursesRes = await axios.post("http://localhost:4000/courses/student", { courses: res[4] }, { headers: { "Content-Type": "application/json" } });
          if (coursesRes.data !== undefined) setResults(coursesRes.data);
        }
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setCoursesLoading(false);
    }
  };
  const getBalance = async () => {
    try {
      if (t_contract !== undefined && id.id != null) {
        const res = await t_contract.methods.getBalance(address).call();
        setBalance(res);
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };
  const buyToken = async (total) => {
    if (!tokens || parseInt(tokens) <= 0) {
      alert("Please enter a valid number of tokens");
      return;
    }
    setPurchasingTokens(true);
    try {
      if (ts_contract !== undefined && id.id != null) {
        await ts_contract.methods.buyTokens(parseInt(tokens)).send({ from: address, value: tokens * tokenPrice }, (err, hash) => {
          if (err) {
            console.error("Error: ", err);
            setPurchasingTokens(false);
          } else {
            console.log("Hash: ", hash);
            setTokens(0);
            getBalance();
            setPurchasingTokens(false);
          }
        });
      }
    } catch (err) {
      console.error("Error buying tokens:", err);
      setPurchasingTokens(false);
    }
  };
  const ShowResults = () => {
    return (
      <div>
        {results.map((el, idx) => (
          <CourseCard
            key={idx}
            title={el.name}
            s_name={name}
            deadline={deadline}
            desc={el.description}
            subs={el.users}
            price={el.price}
            c_id={el.id}
            author={el.author}
            id={id.id}
            thumbnail={el.thumbnail}
            type={false}
          />
        ))}
      </div>
    );
  };
  const ShowAvailableCourses = () => {
    const handlePurchaseSuccess = async () => {
      await getCourses();
      await getAllAvailableCourses();
    };
    return (
      <div>
        {allCourses.map((el, idx) => (
          <CourseCard
            key={idx}
            contract={contract}
            t_contract={t_contract}
            title={el.name}
            address={address}
            author_id={el.author_id}
            desc={el.description}
            subs={el.users}
            price={el.price}
            c_id={el.id}
            ts_contract={ts_contract}
            author_address={el.address}
            author={el.author}
            id={id.id}
            thumbnail={el.thumbnail}
            type={true}
            user={id.user}
            onPurchaseSuccess={handlePurchaseSuccess}
          />
        ))}
      </div>
    );
  };
  if (contract === undefined) {
    return <MetamaskError />;
  } else if (id.id == null) {
    return (
      <div className="Error">
        <h1>You are not authorised to view this page</h1>
        <Link to="/">Home</Link>
      </div>
    );
  } else
    return (
      <div className="student-container">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <div className="student-layout">
            <div className="left-tabs-nav">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first" className="nav-link">
                    <i className="fas fa-book" style={{ marginRight: "10px" }}></i>
                    My Courses
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second" className="nav-link">
                    <i className="fas fa-store" style={{ marginRight: "10px" }}></i>
                    Browse Courses
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third" className="nav-link">
                    <i className="fas fa-wallet" style={{ marginRight: "10px" }}></i>
                    Payments
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <div className="right-content">
              <Tab.Content>
                <Tab.Pane eventKey="first" className="tab-pane-content">
                  <InfoPanel address={address} name={name} />
                  <div className="courses-section">
                    <h4><i className="fas fa-graduation-cap" style={{ marginRight: "10px" }}></i>My Courses</h4>
                    {coursesLoading ? (
                      <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading-text">Loading courses...</p>
                      </div>
                    ) : (
                      <div className="courses-list">
                        {results.length === 0 ? (
                          <div className="empty-state">
                            <i className="fas fa-book-open"></i>
                            <h5>No Courses Yet</h5>
                            <p>You haven't enrolled in any courses. Visit the Browse Courses tab to explore available courses!</p>
                          </div>
                        ) : (
                          <ShowResults />
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second" className="tab-pane-content">
                  <div className="courses-section">
                    <h4><i className="fas fa-store" style={{ marginRight: "10px" }}></i>Available Courses</h4>
                    {allCoursesLoading ? (
                      <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading-text">Loading courses...</p>
                      </div>
                    ) : (
                      <div className="courses-list">
                        {allCourses.length === 0 ? (
                          <div className="empty-state">
                            <i className="fas fa-inbox"></i>
                            <h5>No Courses Available</h5>
                            <p>There are no courses available right now. Please check back later!</p>
                          </div>
                        ) : (
                          <ShowAvailableCourses />
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="third" className="tab-pane-content">
                  <div className="payments-section">
                    <div className="balance-display">
                      <div className="balance-info">
                        <p className="balance-label">Your Current Balance</p>
                        <Badge variant="success" className="balance-badge">{balance} EDBX</Badge>
                      </div>
                    </div>
                    <div className="token-purchase-form">
                      <h5 className="form-title">
                        <i className="fas fa-coins" style={{ marginRight: "8px" }}></i>
                        Purchase EDBX Tokens
                      </h5>
                      <div className="form-group">
                        <label htmlFor="edbx" className="form-label">Enter Amount of Tokens</label>
                        <input
                          type="number"
                          id="edbx"
                          name="edbx"
                          className="form-control token-input"
                          placeholder="0"
                          value={tokens}
                          onChange={(e) => {
                            setTokens(e.target.value);
                          }}
                          disabled={purchasingTokens}
                          min="1"
                        />
                      </div>
                      <div className="conversion-display">
                        <div className="conversion-badge">
                          <p className="conversion-label">Wei Value</p>
                          <Badge variant="info" className="conversion-value">{tokens ? (tokens * 100000000000000).toLocaleString() : "0"}</Badge>
                        </div>
                        <div className="conversion-badge">
                          <p className="conversion-label">Ether Value</p>
                          <Badge variant="info" className="conversion-value">{tokens ? (tokens * 0.0001).toFixed(4) : "0.0000"}</Badge>
                        </div>
                      </div>
                      <Button
                        className="purchase-button"
                        onClick={() => buyToken(tokens)}
                        disabled={purchasingTokens || !tokens || parseInt(tokens) <= 0}
                      >
                        {purchasingTokens ? (
                          <>
                            <span className="button-spinner"></span>
                            Purchasing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-shopping-cart" style={{ marginRight: "8px" }}></i>
                            Buy Tokens
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </div>
    );
};

export default Student;
