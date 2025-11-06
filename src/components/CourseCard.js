import React, { useState } from "react";
import "../styles/CourseCard.css";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const axios = require("axios");

export const CourseCard = ({ address, contract, ts_contract, title, author_id, s_name, c_id, desc, subs, price, author, thumbnail, id, type, user, author_address, deadline, onPurchaseSuccess }) => {
  const [loading, setLoading] = useState(false);

  const purchase = async () => {
    setLoading(true);
    try {
      if (id === null) {
        alert("Create a Student Account to Purchase");
        setLoading(false);
        return;
      }

      if (!ts_contract || !contract) {
        alert("Smart contracts not loaded. Please refresh the page.");
        setLoading(false);
        return;
      }

      const paymentTx = await new Promise((resolve, reject) => {
        ts_contract.methods.payEducator(author_address, parseInt(price)).send({ from: address })
          .on('receipt', (receipt) => {
            console.log("Payment receipt:", receipt);
            resolve(receipt);
          })
          .on('error', (err) => {
            console.error("Payment error:", err);
            reject(err);
          });
      });

      const courseTx = await new Promise((resolve, reject) => {
        contract.methods.buyCourse(parseInt(id), parseInt(c_id), parseInt(Math.round(new Date().getTime() / 1000)), parseInt(author_id)).send({ from: address })
          .on('receipt', (receipt) => {
            console.log("Course purchase receipt:", receipt);
            resolve(receipt);
          })
          .on('error', (err) => {
            console.error("Course purchase error:", err);
            reject(err);
          });
      });

      await axios.post("http://localhost:4000/courses/updateusers", { course_id: c_id }, { headers: { "Content-Type": "application/json" } });

      alert("Course purchased successfully!");
      setLoading(false);
      if (onPurchaseSuccess) onPurchaseSuccess();
    } catch (err) {
      console.error("Purchase error:", err);
      alert("Error during purchase. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div className="course-card">
      <div className="course-img">
        <img src={`data:image/png;base64,${thumbnail}`} alt="course_img"></img>
      </div>
      <div className="course-content">
        <p id="course-title">{title || "No data"}</p>
        <p id="course-desc">{desc || "No data"}</p>
        <p id="course-subs">
          Users: <Badge variant="info">{subs || "0"}</Badge>
        </p>
        <p id="course-price">
          Price: <Badge variant="success">{price || "No data"} EDBX</Badge>
        </p>
        <p id="course-author">
          Author: <Badge variant="secondary">{author || "No data"}</Badge>
        </p>
        {!type ? (
          <Link to={{ pathname: "/course", c_id: c_id, c_name: title, s_name: s_name, deadline: deadline }}>
            <Button>Open Course</Button>
          </Link>
        ) : (
          <Button className="btn-info" onClick={purchase} disabled={user === "educator"}>
            {loading ? <Loader type="TailSpin" height="25" width="25" color="#fff" /> : "Purchase"}
          </Button>
        )}
      </div>
    </div>
  );
};
export default CourseCard;
