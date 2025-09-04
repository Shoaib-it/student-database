import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // For Create & Update
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [editId, setEditId] = useState(null);

  const studentsCollection = collection(db, "student-data");

  // READ: Fetch Data
  const fetchData = async () => {
    const q = query(studentsCollection, orderBy("Id", "asc"));
    const querySnapShot = await getDocs(q);
    const realdata = querySnapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(realdata);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE: Add Student
  const handleAdd = async () => {
    if (newName && newId) {
      await addDoc(studentsCollection, { Name: newName, Id: Number(newId) });
      setNewName("");
      setNewId("");
      fetchData();
    }
  };

  // UPDATE: Edit Student
  const handleEdit = async (student) => {
    setEditId(student.id);
    setNewName(student.Name);
    setNewId(student.Id);
  };

  const handleUpdate = async () => {
    const studentDoc = doc(db, "student-data", editId);
    await updateDoc(studentDoc, { Name: newName, Id: Number(newId) });
    setEditId(null);
    setNewName("");
    setNewId("");
    fetchData();
  };

  // DELETE: Remove Student
  const handleDelete = async (id) => {
    const studentDoc = doc(db, "student-data", id);
    await deleteDoc(studentDoc);
    fetchData();
  };

  // SEARCH: Filter by Name
  const filteredData = data.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{loading ? "Loading..." : "Student Data"}</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />

      {/* Add / Edit Form */}
      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Student Id"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Student Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={styles.input}
        />
        {editId ? (
          <button onClick={handleUpdate} style={styles.buttonUpdate}>Update</button>
        ) : (
          <button onClick={handleAdd} style={styles.buttonAdd}>Add</button>
        )}
      </div>

      {/* Student List */}
      <div style={styles.grid}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} style={styles.card}>
              <p><strong>Id:</strong> {item.Id}</p>
              <p><strong>Name:</strong> {item.Name}</p>
              <button onClick={() => handleEdit(item)} style={styles.buttonEdit}>Edit</button>
              <button onClick={() => handleDelete(item.id)} style={styles.buttonDelete}>Delete</button>
            </div>
          ))
        ) : (
          !loading && <p>No students found</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center", backgroundColor: "#f0f2f5", minHeight: "100vh" },
  title: { color: "#333", marginBottom: "20px" },
  input: { padding: "8px", margin: "5px", width: "150px", borderRadius: "5px", border: "1px solid #ccc" },
  buttonAdd: { padding: "8px 12px", margin: "0 5px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  buttonUpdate: { padding: "8px 12px", margin: "0 5px", backgroundColor: "#2196f3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  buttonEdit: { padding: "5px 10px", marginRight: "5px", backgroundColor: "#ff9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  buttonDelete: { padding: "5px 10px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  grid: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" },
  card: { backgroundColor: "#fff", padding: "15px 25px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", minWidth: "200px", textAlign: "left" },
};

export default App;
