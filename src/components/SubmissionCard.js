import React, { useState } from "react";
import user_logo from "../assets/student1.png";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Badge, Modal } from "react-bootstrap";
import "../styles/SubmissionCard.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const axios = require("axios");

export const SubmissionCard = ({ address, ts_contract, std_name, course_name, std_id, course_id, tx, content, student_address, marks }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setShowErr(false);
  };
  const handleShow = () => setShow(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [grade, setGrade] = useState("");
  const [err, setErr] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [showErr, setShowErr] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
  const uploadMarks = async () => {
    const gradeValue = parseInt(grade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      setErr(true);
      setShowErr(true);
      return;
    }

    try {
      if (gradeValue >= 90) {
        await new Promise((resolve, reject) => {
          ts_contract.methods.rewardToken(student_address, 20).send({ from: address })
            .on('receipt', () => resolve())
            .on('error', reject);
        });
      } else if (gradeValue >= 80) {
        await new Promise((resolve, reject) => {
          ts_contract.methods.rewardToken(student_address, 10).send({ from: address })
            .on('receipt', () => resolve())
            .on('error', reject);
        });
      } else if (gradeValue >= 70) {
        await new Promise((resolve, reject) => {
          ts_contract.methods.rewardToken(student_address, 5).send({ from: address })
            .on('receipt', () => resolve())
            .on('error', reject);
        });
      }

      const res = await axios.post("http://localhost:4000/submissions/uploadmarks", {
        marks: gradeValue,
        course_id: course_id,
        std_id: std_id,
      });

      setShowErr(true);
      setUploaded(true);
      setErr(!res.data.success);
    } catch (err) {
      console.error("Error uploading marks:", err);
      setShowErr(true);
      setErr(true);
    }
  };

  return (
    <div className="submission-card">
      <div className="submit-img">
        <img src={user_logo} alt="user_img"></img>
      </div>
      <div className="submission-content">
        <p id="std-name">Submitted by: {std_name}</p>
        <p id="scourse-title">Course: {course_name}</p>
        <p id="marks">
          Marks: <Badge variant="info">{marks || uploaded ? marks || grade : "Ungraded"}</Badge>
        </p>
        <Button className="btn-info" onClick={handleShow} disabled={marks !== 0}>
          Grade Submission
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Grade Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {content ? (
              <Document className="submission-pdf" file={{ data: content.data }} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
              </Document>
            ) : (
              <p>Unavailable</p>
            )}
            <p>
              Page {pageNumber} of {numPages}
            </p>
            <div className="buttonc">
              <Button disabled={pageNumber <= 1} onClick={previousPage} className="mx-2">
                Previous
              </Button>
              <Button disabled={pageNumber >= numPages} onClick={nextPage}>
                Next
              </Button>
            </div>
            <div className="form-field marks">
              <label htmlFor="grade">
                Marks <i className="fas fa-clipboard-check"></i>
              </label>
              <input
                type="number"
                id="grade"
                name="Grade"
                max="100"
                min="0"
                placeholder="Grade"
                onChange={(e) => {
                  setGrade(e.target.value);
                }}
              ></input>
            </div>
            {showErr ? (
              err ? (
                <div className="alert alert-danger">Unable to set Marks</div>
              ) : (
                <div className="alert alert-success">
                  <p>
                    Marks Updated<i className="fas fa-check"></i>
                  </p>
                </div>
              )
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="success" onClick={uploadMarks} disabled={uploaded}>
              Set Grade
            </Button>
          </Modal.Footer>
        </Modal>
        <p id="tx-hash">Transaction Hash:{tx}</p>
      </div>
    </div>
  );
};
export default SubmissionCard;
