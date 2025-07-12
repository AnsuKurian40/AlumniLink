import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import "./ViewQuestions.css";

const ViewQuestions = () => { 
  const [questions, setQuestions] = useState([]); 
  const [reply, setReply] = useState({}); 
  const [refreshing, setRefreshing] = useState(false); 

  const fetchQuestions = async () => { 
    try { 
      const token = localStorage.getItem("token"); 
      if (!token) { 
        console.error("No token found! Login required."); 
        return; 
      } 

      const res = await axios.get("http://localhost:5000/api/mentorship/questions", { 
        headers: { Authorization: `Bearer ${token}` }, 
      }); 
      setQuestions(res.data); 
    } catch (error) { 
      console.error("Error fetching questions:", error); 
    } finally { 
      setRefreshing(false); 
    } 
  }; 

  useEffect(() => { 
    fetchQuestions(); 
  }, []); 

  const handleReply = async (id) => { 
    try { 
      const token = localStorage.getItem("token"); 
      if (!token) return; 

      setRefreshing(true); 
      await axios.post( 
        `http://localhost:5000/api/mentorship/reply/${id}`, 
        { answer: reply[id] }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      ); 
      await fetchQuestions();
      setReply((prev) => ({ ...prev, [id]: "" })); 
    } catch (error) { 
      console.error("Error sending reply:", error); 
      setRefreshing(false); 
    } 
  }; 

  const handleIgnore = async (id) => { 
    try { 
      const token = localStorage.getItem("token"); 
      if (!token) return; 

      setRefreshing(true); 
      await axios.post( 
        `http://localhost:5000/api/mentorship/ignore/${id}`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } } 
      ); 
      setQuestions(questions.filter(q => q._id !== id)); 
    } catch (error) { 
      console.error("Error ignoring question:", error); 
      setRefreshing(false); 
    } 
  }; 

  return ( 
    <div className="view-questions-container">
      <h2 className="view-questions-title">Student Questions</h2>
      {refreshing && <div className="updating-indicator">Updating...</div>}
      
      {questions.length === 0 ? (
        <div className="empty-state">
          <p>No unanswered questions found</p>
        </div>
      ) : (
        <div className="questions-list">
          {questions.map((q, index) => (
            <div 
              key={q._id} 
              className="question-card"
              style={{ "--index": index }}
            >
              <div className="question-header">
                <p className="student-name">{q.studentName}:</p>
                <p className="question-text">{q.question}</p>
              </div>

              <div className="reply-form">
                <textarea
                  placeholder="Type your reply..."
                  value={reply[q._id] || ""}
                  onChange={(e) => setReply({ ...reply, [q._id]: e.target.value })}
                  className="reply-textarea"
                  rows="3"
                />
                <div className="button-group">
                  <button
                    onClick={() => handleReply(q._id)}
                    disabled={!reply[q._id] || refreshing}
                    className="button reply-button"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => handleIgnore(q._id)}
                    disabled={refreshing}
                    className="button ignore-button"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ); 
}; 

export default ViewQuestions;