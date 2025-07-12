import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import "./WorkshopPage.css"; 
 
const WorkshopsPage = () => { 
    const [workshops, setWorkshops] = useState([]); 
 
    useEffect(() => { 
        const fetchWorkshops = async () => { 
            try { 
                const response = await axios.get("http://localhost:5000/api/workshops"); // Adjust your API endpoint 
                setWorkshops(response.data); 
            } catch (error) { 
                console.error("Error fetching workshops:", error); 
            } 
        }; 
 
        fetchWorkshops(); 
    }, []); 
 
    const groupByAlumni = () => { 
        return workshops.reduce((acc, workshop) => { 
            const alumniName = workshop.postedBy.name; 
            if (!acc[alumniName]) { 
                acc[alumniName] = { 
                    workshops: [], 
                    count: workshop.workshopCountByAlumni,  // Store count from backend 
                }; 
            } 
            acc[alumniName].workshops.push(workshop); 
            return acc; 
        }, {}); 
    }; 
     
 
    const groupedWorkshops = groupByAlumni(); 
 
    return ( 
        <div className="workshops-page"> 
            <h2>Workshops Posted by Alumni</h2> 
            {Object.keys(groupedWorkshops).map((alumniName) => ( 
    <div key={alumniName} className="workshops-by-alumni"> 
        <h3>{alumniName} (posted {groupedWorkshops[alumniName].count} 
{groupedWorkshops[alumniName].count === 1 ? "workshop" : "workshops"})</h3> 
        <ul> 
            {groupedWorkshops[alumniName].workshops.map((workshop) => ( 
                <li key={workshop._id}> 
                    <h4>{workshop.title}</h4> 
                    <p>{workshop.organizer} - {workshop.location}</p> 
                    <p>{workshop.description}</p> 
                    <p>{new Date(workshop.date).toLocaleDateString()} - {workshop.duration}</p> 
                </li> 
            ))} 
        </ul> 
    </div> 
))} 
 
        </div> 
    ); 
}; 
 
export default WorkshopsPage;