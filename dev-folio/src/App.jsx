import Navbar from './components/Navbar'
import ProjectCard from './components/ProjectCard';

const projectDatas = [
    {id:1, title:"project data 1 title", description:"project data description 1", link:"#"},
    {id:2, title:"project data 2 title", description:"project data description 2", link:"#"},
    {id:3, title:"project data 3 title", description:"project data description 3", link:"#"}
  ];
function App() {
  return (
    <div>
      <Navbar/>
      <main>
        {projectDatas.map( (projectData) => (
          <ProjectCard 
          key={projectData.id}
          title={projectData.title} 
          description={projectData.description} 
          link={projectData.link}/>
        ))}
      </main>
    </div>
  )
}

export default App;
