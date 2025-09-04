import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebaseConfig";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "student-data"),
        orderBy("Id", "asc")
      );
      const querySnapShot = await getDocs(q);
      const realdata = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(realdata);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {loading ? "Data is loading..." : "Student Data"}
      </h2>
      <div style={styles.grid}>
        {data.map((item) => (
          <div key={item.id} style={styles.card}>
            <p>
              <strong>Id:</strong> {item.Id}
            </p>
            <p>
              <strong>Name:</strong> {item.Name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
  },
  title: {
    color: "#333",
    marginBottom: "20px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "15px 25px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    minWidth: "200px",
    textAlign: "left",
  },
};

export default App;
