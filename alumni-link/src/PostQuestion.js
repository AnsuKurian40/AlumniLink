import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PostQuestion.css";

const PostQuestion = () => {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch User's Questions on Load
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/mentorship/my-questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data);
      } catch (error) {
        console.error("Error fetching questions:", error.response?.data || error.message);
      }
    };

    fetchQuestions();
  }, [token]);

  // Handle Posting a Question
  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question!");
      return;
    }

    if (!token) {
      console.error("No token found! User might not be logged in.");
      alert("You are not logged in! Please login first.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/mentorship/ask",
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Question posted successfully!");

      if (res.data && res.data.question) {
        setQuestions((prevQuestions) => [...prevQuestions, res.data.question]);
      }

      setQuestion(""); // Clear input after success
    } catch (error) {
      console.error("Error posting question:", error.response?.data || error.message);
      alert("Failed to post question!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-question-container">
      <h2>Ask a Question</h2>
      <textarea
        className="question-textarea"
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="submit-btn"
        onClick={handleAskQuestion}
        disabled={loading}
      >
        {loading ? "Posting..." : "Post Question"}
      </button>

      <h2>Your Questions & Replies</h2>
      <div className="questions-list">
        {questions.length === 0 ? (
          <p>No questions asked yet.</p>
        ) : (
          questions.map((q) => (
            <div className="question-card" key={q._id}>
              <p><strong>You:</strong> {q.question}</p>
              
              {q.answers.length > 0 ? (
                <div className="answers-container">
                  {q.answers.map((ans, index) => (
                    <div className="answer-item" key={index}>
                      <p><strong>{ans.alumniName}:</strong> {ans.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-replies">No replies yet</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostQuestion;