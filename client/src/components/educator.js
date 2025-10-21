import React, { useState, useEffect, useContext } from "react";
import { Nav, Button, Badge, Row, Col, Tab, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Educator.css";
import { UserContext } from "../UserContext";
import SubmissionCard from "./SubmissionCard";
import CourseCard from "./CourseCard";
import Metamask_Error from "./metamask_error";
const axios = require("axios");

export const Educator = ({ address, contract, t_contract, ts_contract }) => {
  const { id } = useContext(UserContext);
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [courseID, setCourseID] = useState(1);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [author, setAuthor] = useState("");
  const [authorID, setAuthorID] = useState(1);
  const [price, setPrice] = useState(0);
  const [ques, setQues] = useState("");
  const [dline, setDline] = useState(1);
  const [results, setResults] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [thumbnail, setThumbnail] = useState();
  const [content, setContent] = useState();
  const [isThumbnailPicked, setThumbnailPicked] = useState(false);
  const [isContentPicked, setContentPicked] = useState(false);
  const [cd, setCD] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getDetails = async () => {
      if (contract !== undefined && id.id != null) {
        await contract.methods
          .getCourseCount()
          .call()
          .then((res) => {
            if (isMounted) setCourseID(parseInt(res[0]) + 1);
          });
        await contract.methods
          .getEducator(id.id)
          .call()
          .then((res) => {
            if (isMounted && res !== null && res !== undefined) {
              setAuthorID(res[0]);
              setAuthor(res[1]);
              if (res[4]) setCount(res[4].length);
            }
          });
      }
    };
    const getSubmissions = async () => {
      try {
        const res = await axios.post("http://localhost:4000/submissions/edu_submissions", { id: id.id }, { headers: { "Content-Type": "application/json" } });
        if (isMounted && res.data !== undefined) setSubmissions(res.data);
      } catch (err) {
        if (isMounted) {
          console.log("Error fetching submissions:", err);
        }
      }
    };
    getDetails();
    getCourses();
    getSubmissions();
    getBalance();

    return () => {
      isMounted = false;
    };
  }, [contract]);

  const t_changeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPicked(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const c_changeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setContent(file);
      setContentPicked(true);
    }
  };

  const uploadCourse = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      await contract.methods.addCourse(name, desc, author, parseInt(price), parseInt(dline), parseInt(authorID)).send({ from: address }, (err, hash) => {
        if (err) console.log("Error: ", err);
        else console.log("Hash: ", hash);
      });
      await contract.methods
        .getCourseCount()
        .call()
        .then((res) => {
          setCD(parseInt(res));
        })
        .catch((err) => {
          console.log(err);
        });
      await contract.methods
        .getCourse(parseInt(cd))
        .call()
        .then((res) => {
          setDline(res[7]);
        })
        .catch((err) => {
          console.log(err);
        });
      const form = new FormData();
      form.append("name", name);
      form.append("id", courseID);
      form.append("description", desc);
      form.append("author", author);
      form.append("author_id", authorID);
      form.append("address", address);
      form.append("price", price);
      form.append("question", ques);
      form.append("deadline", dline);
      form.append("thumbnail", thumbnail);
      form.append("content", content);
      await axios.post("http://localhost:4000/courses/upload", form);
      setCount(count + 1);
      getCourses();
      setCourseID(courseID + 1);
      handleClose();
      setThumbnailPreview(null);
      setThumbnail(null);
      setContent(null);
      setThumbnailPicked(false);
      setContentPicked(false);
      setName("");
      setDesc("");
      setQues("");
      setPrice(0);
      setDline(1);
    } catch (err) {
      console.log("Error uploading course:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const getCourses = async () => {
    setCoursesLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/courses/educator", { id: id.id }, { headers: { "Content-Type": "application/json" } });
      if (res.data !== undefined) setResults(res.data);
    } catch (err) {
      console.log("Error fetching courses:", err);
    } finally {
      setCoursesLoading(false);
    }
  };

  const ShowResults = () => {
    return (
      <div>
        {results.map((el, idx) => (
          <CourseCard
            key={idx}
            title={el.name}
            c_id={el.id}
            s_name={"Kevin Peter"}
            desc={el.description}
            subs={el.users}
            price={el.price}
            author={el.author}
            id={id.id}
            thumbnail={el.thumbnail}
            type={false}
          />
        ))}
      </div>
    );
  };

  const ShowSubmissions = () => {
    return (
      <div>
        {submissions.map((el, idx) => (
          <SubmissionCard
            key={idx}
            address={address}
            std_name={el.std_name}
            marks={el.marks}
            course_name={el.course_name}
            std_id={el.std_id}
            course_id={el.course_id}
            contract={contract}
            tx={el.transaction_hash}
            content={el.content}
            student_address={el.address}
            ts_contract={ts_contract}
          />
        ))}
      </div>
    );
  };

  const getBalance = async () => {
    if (t_contract !== undefined && id.id != null) {
      await t_contract.methods
        .getBalance(address)
        .call()
        .then((res) => {
          console.log(res);
          if (res != null) {
            setBalance(res);
          }
        });
    }
  };

  if (contract === undefined) {
    return <Metamask_Error />;
  } else if (id.id === null) {
    return (
      <div className="Error">
        <h1>You are not authorised to view this page</h1>
        <Link to="/">Home</Link>
      </div>
    );
  } else
    return (
      <div className="educator-container">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <div className="educator-layout">
            <div className="left-tabs-nav">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first" className="nav-link">
                    <i className="fas fa-book" style={{ marginRight: "10px" }}></i>
                    Courses
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second" className="nav-link">
                    <i className="fas fa-file-alt" style={{ marginRight: "10px" }}></i>
                    Submissions
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
                  <div className="info-panel">
                    <div className="panel-left">
                      <h4 className="welcome-text">Welcome {author || null}</h4>
                      <p className="address-text">Address: {address || null}</p>
                    </div>
                    <div className="panel-right">
                      <Button className="add-course-btn" onClick={handleShow}>
                        <i className="fas fa-plus" style={{ marginRight: "8px" }}></i>
                        Add Course
                      </Button>
                    </div>
                  </div>
                  <Modal show={show} onHide={handleClose} animation={false} size="lg">
                    <Modal.Header closeButton disabled={isUploading}>
                      <Modal.Title>
                        <i className="fas fa-plus-circle" style={{ marginRight: "8px" }}></i>
                        Add New Course
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={isUploading ? "uploading-state" : ""}>
                      {isUploading && (
                        <div className="upload-overlay">
                          <div className="upload-progress">
                            <div className="spinner-large"></div>
                            <p className="upload-text">Publishing your course...</p>
                          </div>
                        </div>
                      )}
                      <form className="form-container">
                        <div className="form-field">
                          <label htmlFor="name">
                            <i className="fas fa-signature"></i>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Course Title"
                            disabled={isUploading}
                            onChange={(e) => {
                              setName(e.target.value);
                            }}
                          ></input>
                        </div>
                        <div className="form-field">
                          <label htmlFor="desc">
                            <i className="fas fa-comment-alt"></i>
                          </label>
                          <input
                            type="text"
                            id="desc"
                            name="desc"
                            placeholder="Course Description"
                            disabled={isUploading}
                            onChange={(e) => {
                              setDesc(e.target.value);
                            }}
                          ></input>
                        </div>
                        <div className="form-field">
                          <label htmlFor="price">
                            <i className="fas fa-dollar-sign"></i>
                          </label>
                          <input
                            type="text"
                            id="price"
                            name="price"
                            placeholder="Course Price"
                            disabled={isUploading}
                            onChange={(e) => {
                              setPrice(e.target.value);
                            }}
                          ></input>
                        </div>
                        <div className="form-field">
                          <label htmlFor="assignment">
                            <i className="fas fa-file-alt"></i>
                          </label>
                          <input
                            type="text"
                            id="assgn"
                            name="assgn"
                            placeholder="Assignment Question"
                            disabled={isUploading}
                            onChange={(e) => {
                              setQues(e.target.value);
                            }}
                          ></input>
                        </div>
                        <div className="form-field">
                          <label htmlFor="deadline">
                            <i className="fas fa-calendar-check"></i>
                          </label>
                          <input
                            type="number"
                            id="deadline"
                            name="deadline"
                            placeholder="Deadline (days)"
                            disabled={isUploading}
                            onChange={(e) => {
                              setDline(e.target.value);
                            }}
                          ></input>
                        </div>
                      </form>
                      <div className="file-upload-container">
                        <div className="file-input-section">
                          <label className="file-input-label">
                            <i className="fas fa-image" style={{ marginRight: "8px" }}></i>
                            Course Thumbnail
                          </label>
                          <input
                            type="file"
                            name="thumbnail"
                            disabled={isUploading}
                            onChange={t_changeHandler}
                            accept="image/*"
                          />
                          {isThumbnailPicked && thumbnailPreview && (
                            <div className="thumbnail-preview-container">
                              <div className="thumbnail-preview">
                                <img src={thumbnailPreview} alt="Course Thumbnail Preview" />
                              </div>
                              <p className="file-info">
                                <i className="fas fa-check-circle" style={{ marginRight: "6px", color: "#28a745" }}></i>
                                Size: {(thumbnail.size / 1000000).toFixed(1)} MB
                              </p>
                            </div>
                          )}
                          {!isThumbnailPicked && (
                            <p className="file-placeholder">
                              <i className="fas fa-cloud-upload-alt" style={{ marginRight: "8px" }}></i>
                              Click to upload course thumbnail
                            </p>
                          )}
                        </div>
                        <div className="file-input-section">
                          <label className="file-input-label">
                            <i className="fas fa-file-pdf" style={{ marginRight: "8px" }}></i>
                            Course Content
                          </label>
                          <input
                            type="file"
                            name="content"
                            disabled={isUploading || !isThumbnailPicked}
                            onChange={c_changeHandler}
                            accept=".pdf,.doc,.docx"
                          />
                          {isContentPicked && content && (
                            <p className="file-info">
                              <i className="fas fa-check-circle" style={{ marginRight: "6px", color: "#28a745" }}></i>
                              Size: {(content.size / 1000000).toFixed(1)} MB
                            </p>
                          )}
                          {!isThumbnailPicked && (
                            <p className="file-placeholder disabled-text">
                              <i className="fas fa-lock" style={{ marginRight: "8px" }}></i>
                              Upload thumbnail first
                            </p>
                          )}
                          {isThumbnailPicked && !isContentPicked && (
                            <p className="file-placeholder">
                              <i className="fas fa-cloud-upload-alt" style={{ marginRight: "8px" }}></i>
                              Click to upload course content
                            </p>
                          )}
                        </div>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="outline-secondary" onClick={handleClose} disabled={isUploading}>
                        <i className="fas fa-times" style={{ marginRight: "6px" }}></i>
                        Cancel
                      </Button>
                      <Button
                        variant="success"
                        onClick={uploadCourse}
                        disabled={isUploading || !isThumbnailPicked || !isContentPicked || !name || !desc || !price || !ques || !dline}
                        className={isUploading ? "btn-uploading" : ""}
                      >
                        {isUploading ? (
                          <>
                            <span className="button-spinner"></span>
                            Publishing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check-circle" style={{ marginRight: "6px" }}></i>
                            Publish Course
                          </>
                        )}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <div className="courses-section">
                    <h4><i className="fas fa-chalkboard-user" style={{ marginRight: "10px" }}></i>You have created {count} course{count === 1 ? null : "s"}</h4>
                    {coursesLoading ? (
                      <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading-text">Loading courses...</p>
                      </div>
                    ) : (
                      <div className="courses-list">
                        {results.length === 0 ? (
                          <div className="empty-state">
                            <i className="fas fa-inbox"></i>
                            <p>No courses yet. Create your first course to get started!</p>
                          </div>
                        ) : (
                          <ShowResults />
                        )}
                      </div>
                    )}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second" className="tab-pane-content">
                  <div className="submissions-section">
                    <h4><i className="fas fa-inbox" style={{ marginRight: "10px" }}></i>You have {submissions.length} submission{submissions.length === 1 ? null : "s"}</h4>
                    <div className="submissions-list">
                      {submissions.length === 0 ? (
                        <div className="empty-state">
                          <i className="fas fa-file-alt"></i>
                          <p>No submissions yet. Your students will submit here!</p>
                        </div>
                      ) : (
                        <ShowSubmissions />
                      )}
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="third" className="tab-pane-content">
                  <div className="payments-section">
                    <div className="balance-display">
                      <p>Your Current Balance</p>
                      <Badge variant="success">{balance} EDBX</Badge>
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
export default Educator;
