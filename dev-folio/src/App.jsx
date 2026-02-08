import Navbar from './components/Navbar'
import ProjectCard from './components/ProjectCard';
import { useEffect, useState } from 'react';

function App() {
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
      <Navbar/>
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

export default App;
