import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';

function Home() {
      const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch('/projects.json')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const [filter, setFilter] = useState('All');
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter)
    return (
        <div>
            <div>
            <button type="button" onClick={() => setFilter("MERN")}>MERN</button>
            <button type="button" onClick={() => setFilter("React")}>React</button>
            <button type="button" onClick={() => setFilter("Node")}>Node</button>
            <button type="button" onClick={() => setFilter("All")}>All</button>
            </div>
            <main>
                {filteredProjects.map( (projectData) => (
                <ProjectCard 
                key={projectData.id}
                title={projectData.title} 
                description={projectData.description} 
                link={projectData.link}
                category={projectData.category}/>
                ))}
            </main>    
        </div>
    )
}

export default Home;