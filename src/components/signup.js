import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../styles/Login.css";

export const Signup = ({ address, contract }) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [succ, setSucc] = useState(false);
  const [fail, setFail] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [type, setType] = useState(true);
  const [passerr, setPasserr] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (succ) {
      history.push("/login");
    }
  }, [succ, history]);

  const extractErrorMessage = (error) => {
    if (!error) return "Unknown error occurred";

    try {
      let errorMsg = "";

      if (typeof error === "string") {
        errorMsg = error;
      } else if (error.message && typeof error.message === "string") {
        errorMsg = error.message;
      } else if (error.data && typeof error.data === "string") {
        errorMsg = error.data;
      } else if (error.data && error.data.reason) {
        errorMsg = error.data.reason;
      } else if (error.error && error.error.message) {
        errorMsg = error.error.message;
      } else if (error.reason) {
        errorMsg = error.reason;
      }

      console.log("Extracted error message:", errorMsg);
      console.log("Full error object:", error);

      if (errorMsg.includes("Address already has account")) {
        return "This wallet address already has an account. Please use a different wallet address or login to your existing account.";
      }

      if (errorMsg.includes("User denied") || errorMsg.includes("user denied")) {
        return "You rejected the transaction. Please approve the MetaMask transaction to continue.";
      }

      if (errorMsg.includes("revert")) {
        const match = errorMsg.match(/revert (.+?)(?:\n|$)/);
        if (match) return match[1];
      }

      if (errorMsg.includes("Internal JSON-RPC")) {
        return "Blockchain error. Please check that: 1) MetaMask is connected to the correct network, 2) The smart contract is properly deployed, 3) Refresh the page and try again.";
      }

      if (errorMsg.includes("JSON-RPC") || errorMsg.includes("Internal error")) {
        return "Network error. Please ensure MetaMask is connected to a valid network and try again.";
      }

      if (errorMsg.includes("insufficient funds")) {
        return "Insufficient gas fees. Please ensure you have enough ETH in your wallet.";
      }

      if (errorMsg.includes("nonce")) {
        return "Transaction nonce error. Please refresh the page and try again.";
      }

      if (errorMsg) return errorMsg;
      if (error.message) return String(error.message);

      return "Registration failed. Please check your connection and try again.";
    } catch (e) {
      console.error("Error extracting error message:", e);
      return "Registration failed. Please try again.";
    }
  };

  const addUser = async () => {
    if (!address) {
      setLoading(false);
      setErrorMsg("Wallet not connected. Please connect your MetaMask wallet and try again.");
      setFail(true);
      return;
    }

    if (!contract) {
      setLoading(false);
      setErrorMsg("Contract not loaded. Please refresh the page and ensure you're connected to the correct network where the smart contracts are deployed.");
      setFail(true);
      return;
    }

    try {
      const methodName = type === true ? "addStudent" : "addEducator";

      if (!contract.methods[methodName]) {
        setLoading(false);
        setErrorMsg(`Contract method '${methodName}' not found. The smart contract may not be properly deployed.`);
        setFail(true);
        return;
      }

      const method = contract.methods[methodName](name, pass);

      method.estimateGas({ from: address })
        .then((gasEstimate) => {
          console.log("Gas estimate:", gasEstimate);

          method.send({
            from: address,
            gas: Math.floor(gasEstimate * 1.2)
          })
            .on('transactionHash', (hash) => {
              console.log("Transaction hash: ", hash);
            })
            .on('receipt', (receipt) => {
              console.log("Receipt: ", receipt);
              setLoading(false);
              setSucc(true);
            })
            .on('error', (err) => {
              console.error("Transaction error object:", err);
              console.error("Transaction error message:", err?.message);
              console.error("Transaction error string:", String(err));
              setLoading(false);
              const msg = extractErrorMessage(err);
              setErrorMsg(msg);
              setFail(true);
            })
            .catch((err) => {
              console.error("Catch error object:", err);
              console.error("Catch error message:", err?.message);
              console.error("Catch error string:", String(err));
              setLoading(false);
              const msg = extractErrorMessage(err);
              setErrorMsg(msg);
              setFail(true);
            });
        })
        .catch((gasErr) => {
          console.error("Gas estimation error:", gasErr);
          setLoading(false);
          const msg = extractErrorMessage(gasErr);
          setErrorMsg(msg);
          setFail(true);
        });
    } catch (err) {
      console.error("Setup error: ", err);
      setLoading(false);
      const msg = extractErrorMessage(err);
      setErrorMsg(msg);
      setFail(true);
    }
  };
  const passError = () => {
    return (
      <div className="alert alert-danger" role="alert">
        <p>Password should contain more than 8 characters</p>
      </div>
    );
  };
  const failure = () => {
    return (
      <div className="alert alert-danger" role="alert">
        <h4>Registration Failed</h4>
        <p>{errorMsg || "Try again after sometime"}</p>
      </div>
    );
  };

  const post = () => {
    if (pass.length < 8) {
      setPasserr(true);
    } else if (!name.trim()) {
      setErrorMsg("Please enter your name");
      setFail(true);
    } else if (!address) {
      setErrorMsg("Wallet not connected. Please connect your MetaMask wallet and try again.");
      setFail(true);
    } else {
      setPasserr(false);
      setLoading(true);
      addUser();
    }
  };
  return (
    <div className="outer-container justify-content-center">
      <div className="text-center py-2">{fail ? failure() : null}</div>
      <div className="text-center py-2">
        <h4>Signup</h4>
      </div>
      <div className="col-md-4 offset-md-4 py-2">
        <form>
          <div className="form-field">
            <span>
              <i className="fas fa-user-circle fa-2x"></i>
            </span>
            <input className="form-control my-2" type="text" id="name" name="name" placeholder="Name" onChange={(e) => {
              setName(e.target.value);
              if (fail) setFail(false);
            }}></input>
          </div>
          <div className="form-field">
            <span>
              <i className="fas fa-key fa-2x"></i>
            </span>
            <input className="form-control my-2" type="password" id="pass" name="pass" placeholder="Password" onChange={(e) => {
              setPass(e.target.value);
              if (fail) setFail(false);
            }}></input>
          </div>
          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customSwitchesChecked"
              defaultChecked
              onChange={(e) => {
                setType(!type);
              }}
            />
            <label className="custom-control-label" htmlFor="customSwitchesChecked">
              {type ? "Student Account" : "Educator Account"}
            </label>
          </div>
          {passerr ? passError() : null}
        </form>
      </div>
      <div className="col-md-4 offset-md-4 text-center py-2">
        <button type="submit" className="btn btn-success" onClick={post}>
          {loading ? <Loader type="TailSpin" height="30" width="30" color="#fff" /> : "Register"}
        </button>
        <div className="access-info">
          <span>
            <i className="fas fa-hand-point-right fa-2x"></i>
          </span>
          <p>
            <em>Already have an account?&nbsp;</em>
            <Link to={"/login"}> Login!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
