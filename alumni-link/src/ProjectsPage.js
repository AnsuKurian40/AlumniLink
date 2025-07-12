import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import "./ProjectsPage.css"; 
 
const ProjectsPage = () => { 
    const [projects, setProjects] = useState({}); 
 
    useEffect(() => { 
        const fetchProjects = async () => { 
            try { 
                const response = await axios.get("http://localhost:5000/api/projects"); 
                 
                // Group projects by alumni name 
                const groupedProjects = response.data.reduce((acc, project) => { 
                    const alumniName = project.userId?.name || "Unknown Alumni"; // Fallback if no name 
                    if (!acc[alumniName]) { 
                        acc[alumniName] = []; 
                    } 
                    acc[alumniName].push(project); 
                    return acc; 
                }, {}); 
                 
                setProjects(groupedProjects); 
            } catch (error) { 
                console.error("Error fetching projects:", error); 
            } 
        }; 
 
        fetchProjects(); 
    }, []); 
 
    return ( 
        <div className="projects-page"> 
            <h2>Projects Posted by Alumni</h2> 
            {/* Check if there are any projects */} 
            {Object.keys(projects).length === 0 ? ( 
                <p>No projects available at the moment.</p> 
            ) : ( 
                Object.keys(projects).map((alumniName) => ( 
                    <div key={alumniName} className="projects-by-alumni"> 
                        {/* <h3>{alumniName}</h3>  */}
                        <ul> 
                            {Array.isArray(projects[alumniName]) && projects[alumniName].map((project) => ( 
                                <li key={project._id}> 
                                    <h4>{project.title}</h4> 
                                    <p>{project.description}</p> 
                                    <p>Required Skills: {project.requiredSkills.join(", ")}</p> 
                                    <p>Expected Contribution: {project.expectedContribution}</p> 
                                    <p>Collaboration Mode: {project.collaborationMode}</p> 
                                </li> 
                            ))} 
                        </ul> 
                    </div> 
                )) 
            )} 
        </div> 
    ); 
}; 
 
export default ProjectsPage;