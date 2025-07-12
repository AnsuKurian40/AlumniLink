import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import { FaTrash } from "react-icons/fa"; 
import "./MentorshipPage.css"; 
 
const MentorshipPage = () => { 
    const [mentorship, setMentorship] = useState({}); 
 
    useEffect(() => { 
        const fetchMentorship = async () => { 
            try { 
                const response = await axios.get("http://localhost:5000/api/mentorship"); 
                setMentorship(response.data); 
            } catch (error) { 
                console.error("  Error fetching mentorship questions:", error); 
            } 
        }; 
 
        fetchMentorship(); 
    }, []); 
 
    const handleDelete = async (questionId) => { 
        if (window.confirm("Are you sure you want to delete this question?")) { 
            try { 
                console.log("Deleting question with ID:", questionId); 
                const response = await axios.delete(`http://localhost:5000/api/mentorship/${questionId}`); 
 
                if (response.status === 200) { 
                    setMentorship((prevMentorship) => { 
                        const updatedMentorship = { ...prevMentorship }; 
                        Object.keys(updatedMentorship).forEach((studentName) => { 
                            updatedMentorship[studentName] = updatedMentorship[studentName].filter( 
                                (question) => question._id !== questionId 
                            ); 
                        }); 
                        return updatedMentorship; 
                    }); 
                    alert("   Question deleted successfully"); 
                } else { 
                    alert("  Failed to delete question."); 
                } 
            } catch (error) { 
                console.error("  Error deleting question:", error); 
                alert("  Error deleting question. Please try again."); 
            } 
        } 
    }; 
 
    return ( 
        <div className="mentorship-page"> 
            <h2>Mentorship Questions by Students</h2> 
            {Object.keys(mentorship).map((studentName) => ( 
                <div key={studentName} className="questions-by-student"> 
                    <h3>{studentName}</h3> 
                    <ul> 
                        {mentorship[studentName].map((question) => ( 
                            <li key={question._id}> 
                                <h4>Question: {question.question}</h4> 
 
                                {/*    Display Answers (Single or Multiple) */} 
                                {question.answers && question.answers.length > 0 ? ( 
                                    <div className="answers-container"> 
                                        {question.answers.map((ans, index) => ( 
                                            <p key={index}> 
                                                <strong>{ans.alumniName}:</strong> {ans.answer} 
                                            </p> 
                                        ))} 
                                    </div> 
                                ) : ( 
                                    <p style={{ fontStyle: "italic", color: "#666" }}>No replies yet</p> 
                                )} 
 
                                <div className="question-actions"> 
                                    <button className="icon-button delete" onClick={() => 
handleDelete(question._id)}> 
                                        <FaTrash /> 
                                    </button> 
                                </div> 
                            </li> 
                        ))} 
                    </ul> 
                </div> 
            ))} 
        </div> 
    ); 
}; 
 
export default MentorshipPage;