import React, { useState } from 'react';
import CreateNovel from './components/CreateNovel';
import NovelList from './components/NovelList';

function App() {
  // This state holds the novel currently being edited (or null if creating new)
  const [novelToEdit, setNovelToEdit] = useState(null);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>📖 My Webnovel Platform</h1>
      
      {/* Pass the "novelToEdit" data DOWN to the form */}
      {/* Pass "setNovelToEdit" so the form can clear it when done */}
      <CreateNovel 
        novelToEdit={novelToEdit} 
        onEditComplete={() => setNovelToEdit(null)} 
      />
      
      <hr style={{ margin: '30px 0' }} />
      
      {/* Pass "setNovelToEdit" DOWN so the list can select a novel */}
      <NovelList onEdit={(novel) => setNovelToEdit(novel)} />
    </div>
  );
}

export default App;