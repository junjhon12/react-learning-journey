import Navbar from './components/Navbar'
import ProjectCard from './components/ProjectCard';

function App() {

  return (
    <div>
      <Navbar/>
      <main>
        <ProjectCard title="Project 1" description="Project 1 description" link="#"/>
        <ProjectCard title="Project 2" description="Project 2 description" link="#"/>
        <ProjectCard title="Project 3" description="Project 3 description" link="#"/>
      </main>
    </div>
  )
}

export default App;
