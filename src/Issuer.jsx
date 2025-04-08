import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Issuer = ({ user }) => {
  const [issuerName, setIssuerName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [semester, setSemester] = useState("");
  const [sgpa, setSgpa] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFileName(selectedFile.name);
    setFile(selectedFile);
  };

  const generateUniqueCodeFromName = async (name) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(name);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex.slice(0, 6);
  };

  const handleSubmit = async () => {
    if (!issuerName || !studentName || !semester || !sgpa || !cgpa || !fileName || !file) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const uniqueCode = await generateUniqueCodeFromName(studentName);
    const docId = `${uniqueCode}_${studentName}_sem${semester}`;
    const docRef = doc(db, "users", user.uid, "issued_certificates", docId);

    try {
      await setDoc(docRef, {
        issuer: issuerName,
        student: studentName,
        semester,
        sgpa,
        cgpa,
        hash: fileHashHex,
        code: uniqueCode,
      });

      setSuccessMessage({
        code: uniqueCode,
        hash: fileHashHex,
        semester: semester,
      });
    } catch (error) {
      console.error("Error storing data in Firestore: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="hhh">ISSUER</h2>
      <br />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Issuer Name"
        value={issuerName}
        onChange={(e) => setIssuerName(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter SGPA"
        value={sgpa}
        onChange={(e) => setSgpa(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter CGPA"
        value={cgpa}
        onChange={(e) => setCgpa(e.target.value)}
      />
      <div className="mb-3">
        <input type="file" className="form-control" onChange={handleFileChange} />
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      {successMessage && (
        <div className="alert alert-success mt-3">
          <strong>Success!</strong> Certificate details saved.
          <table className="table mt-3">
            <thead><tr><th>Field</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>Unique Code</td><td>{successMessage.code}</td></tr>
              <tr><td>Hash</td><td>{successMessage.hash}</td></tr>
              <tr><td>Semester</td><td>{successMessage.semester}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Issuer;
