import Navbar from './components/Navbar'
import ProjectCard from './components/ProjectCard';
import { useState } from 'react';

const projectDatas = [
    {id:1, title:"project data 1 title", description:"project data description 1", link:"#", category:"React"},
    {id:2, title:"project data 2 title", description:"project data description 2", link:"#", category:"Node"},
    {id:3, title:"project data 3 title", description:"project data description 3", link:"#", category:"MERN"}
  ];
function App() {
  const [filter, setFilter] = useState('All');
  const filteredProjects = filter === 'All' ? projectDatas : projectDatas.filter(p => p.category === filter)
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
