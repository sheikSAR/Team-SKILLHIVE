import React, { useState, useContext } from "react";
import CourseCard from "./CourseCard";
import { Alert } from "react-bootstrap";
import { UserContext } from "../UserContext";
const axios = require("axios");

export const Search = ({ address, contract, t_contract, ts_contract }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [err, setErr] = useState(false);
  const { id } = useContext(UserContext);

  const getResults = async () => {
    if (!search || search.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/courses/results", { searchterm: search }, { headers: { "Content-Type": "application/json" } });
      if (res.data !== undefined) {
        setErr(false);
        setResults(res.data);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setErr(true);
    }
  };
  const ShowResults = () => {
    if (results.length === 0 && search) {
      return (
        <div className="alert-box">
          <Alert variant="danger" className="alert-dismissible fade show" id="home-alert">
            No results found for "{search}"
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </Alert>
        </div>
      );
    }

    if (results.length === 0) {
      return null;
    }

    return (
      <div>
        {results.map((el, idx) => (
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
          />
        ))}
      </div>
    );
  };
  return (
    <div className="search-box">
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Search for courses" onChange={(e) => setSearch(e.target.value)}></input>
        <div className="input-group-append">
          <button className="btn btn-primary" onClick={getResults}>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      <div className="course-results">
        <ShowResults />
      </div>
    </div>
  );
};

export default Search;
