function ProjectCard(props) {
    return (
        <div className="card">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <a href={props.link}>View Project</a>
        </div>
    );
}

export default ProjectCard;