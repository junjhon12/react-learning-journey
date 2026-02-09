import { recipes } from '../recipes';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Our Recipes</h2>
      
      <div className="recipe-grid" style={styles.grid}>
        {recipes.map((recipe) => (
          <div key={recipe.id} style={styles.card}>
            <img src={recipe.image} alt={recipe.name} style={{ width: '100%' }} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <Link to={`/recipe/${recipe.id}`}>View Recipe →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  card: {
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '8px'
  }
};

export default Home;