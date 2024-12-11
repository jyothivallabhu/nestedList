/* eslint-disable react/prop-types */
import  { useEffect, useState } from 'react'
import { Droppable, Draggable } from "react-beautiful-dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid ,
  margin: `0 10px 10px 0`,
  display: "inline-flex",
  width: "480px", 
  background: isDragging ? "lightgreen" : "#8080808c",
  border: "1px solid grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  margin: "10px 0",
});

// eslint-disable-next-line react/prop-types
const SubItemsComponent = ({ subItems, type, updateSubItemContent  }) => {

  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (index, currentValue) => {
    setEditingIndex(index);
    setEditValue(currentValue);
  };

  const handleBlur = (index) => {
  if (editValue.trim() !== "") {
    updateSubItemContent(type, index, editValue);
  }
  setEditingIndex(null);
};

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && editValue.trim() !== "") {
      updateSubItemContent(type, index, editValue);
      setEditingIndex(null);  // Exit edit mode on Enter
    }
  };
  

  useEffect(() => {
  if (editingIndex !== null) {
    setEditValue(subItems[editingIndex]?.content || "");
  }
}, [editingIndex, subItems]);
console.log(type)
  return (
    <Droppable droppableId={type.toString()} type="droppableSubItem">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {subItems.map((item, index) => {
           return (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div style={{ display: "flex" }}>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                   >
                     
                     {editingIndex === index ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                         onBlur={() => handleBlur(index)}
                         onKeyDown={(e) => handleKeyDown(e, index)}
                         
                      autoFocus
                    />
                  ) : (
                         <span
                        style={{
                          display: "block",
                          margin: "0 10px",
                          border: "1px solid #000",
                          padding:"1px 8px",
                        }}
                           onClick={() => handleEdit(index, item.content)}>
                      {item.content}
                    </span>
                  )}

                      
                      <span
                        {...provided.dragHandleProps}
                        style={{
                          display: "block",
                          margin: "0 10px",
                          border: "1px solid #000",
                        }}
                      >
                        Drag
                      </span>
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};


export default SubItemsComponent