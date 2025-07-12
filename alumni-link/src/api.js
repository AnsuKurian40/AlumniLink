import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

// Alumni posts a new project topic


export const postProjectTopic = async (alumniId, topic, description) => {
    try {
      const response = await axios.post(`${API_URL}/topics`, {
        alumniId,
        topic,
        description,
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message);
      throw error;  // Rethrow error for the catch block in the component to handle
    }
  };
  


// Fetch topics posted by alumni
export const fetchAlumniTopics = async (alumniId) => {
  return axios.get(`${API_URL}/topics/${alumniId}`);
};

// Alumni updates project idea status
export const updateProjectIdea = async (ideaId, status, feedback) => {
  return axios.put(`${API_URL}/ideas/${ideaId}`, { status, feedback });
};

// Fetch all project topics (for students to view)
export const fetchProjectTopics = async () => {
    return axios.get(`${API_URL}/topics`);
  };
  
  // Student submits a project idea
  export const submitProjectIdea = async (studentId, topicId, description) => {
    return axios.post(`${API_URL}/ideas`, { studentId, topicId, description });
  };
  
  // Fetch student's submitted ideas
  export const fetchStudentIdeas = async (studentId) => {
    return axios.get(`${API_URL}/ideas/student/${studentId}`);
  };
  