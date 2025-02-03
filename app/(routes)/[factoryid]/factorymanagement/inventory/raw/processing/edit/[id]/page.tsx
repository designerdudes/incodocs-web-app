"use client"
import React, { useState, useEffect } from 'react';

const EditSlabPage = ({ blockId }) => {
  const [slabs, setSlabs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlab, setCurrentSlab] = useState(null);

  // Fetch slabs from the backend when the component mounts
  useEffect(() => {
    fetch(`factory-management/inventory/finished/get${blockId}`)
      .then((response) => response.json())
      .then((data) => setSlabs(data))
      .catch((error) => console.error('Error fetching slabs:', error));
  }, [blockId]);

  // Handle Delete Slab
  const handleDelete = (slabId) => {
    fetch(`/api/slabs/${slabId}`, { method: 'DELETE' })
      .then(() => {
        setSlabs(slabs.filter((slab) => slab.id !== slabId));
      })
      .catch((error) => console.error('Error deleting slab:', error));
  };

  // Handle Edit Slab
  const handleEdit = (slab) => {
    setIsEditing(true);
    setCurrentSlab(slab);
  };

  // Handle Save Edits
  const handleSave = () => {
    fetch(`/api/slabs/${currentSlab.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        length: currentSlab.length,
        height: currentSlab.height,
      }),
    })
      .then(() => {
        setSlabs(
          slabs.map((slab) =>
            slab.id === currentSlab.id
              ? { ...slab, length: currentSlab.length, height: currentSlab.height }
              : slab
          )
        );
        setIsEditing(false);
        setCurrentSlab(null);
      })
      .catch((error) => console.error('Error updating slab:', error));
  };

  return (
    <div>
      <h2>Edit Slabs</h2>
      <div>
        {slabs.map((slab) => (
          <div key={slab.id} className="slab">
            <div>
              <label>Length: </label>
              {isEditing && currentSlab.id === slab.id ? (
                <input
                  type="number"
                  value={currentSlab.length}
                  onChange={(e) =>
                    setCurrentSlab({ ...currentSlab, length: e.target.value })
                  }
                />
              ) : (
                <span>{slab.length}</span>
              )}
            </div>
            <div>
              <label>Height: </label>
              {isEditing && currentSlab.id === slab.id ? (
                <input
                  type="number"
                  value={currentSlab.height}
                  onChange={(e) =>
                    setCurrentSlab({ ...currentSlab, height: e.target.value })
                  }
                />
              ) : (
                <span>{slab.height}</span>
              )}
            </div>
            <button onClick={() => handleDelete(slab.id)}>Delete</button>
            <button onClick={() => handleEdit(slab)}>Edit</button>
          </div>
        ))}
      </div>
      {isEditing && (
        <div>
          <button onClick={handleSave}>Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default EditSlabPage;
