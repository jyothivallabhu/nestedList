
import  { useState } from 'react'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { static_items } from "./data";

import SubItemsComponent from "./SubItemsComponent"

import './App.css'


// A function to help with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "#80808066",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 500,
});


function App() {

  const updateSubItemContent = (parentId, subIndex, newContent) => {
    const newItems = items.map((item) => {
      if (item.id === parentId) {
        const newSubItems = item.subItems.map((subItem, index) => {
          if (index === subIndex) {
            return { ...subItem, content: newContent };
          }
          return subItem;
        });
        return { ...item, subItems: newSubItems };
      }
      return item;
    });
    setItems(newItems);
  };
  
const [items, setItems] = useState(static_items);
const onDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (result.type === "droppableItem") {
      const reorderedItems = reorder(items, sourceIndex, destIndex);
      setItems(reorderedItems);
    } else if (result.type === "droppableSubItem") {
      const itemSubItemMap = items.reduce((acc, item) => {
        acc[item.id] = item.subItems;
        return acc;
      }, {});

      const sourceParentId = parseInt(result.source.droppableId);
      const destParentId = parseInt(result.destination.droppableId);

      const sourceSubItems = itemSubItemMap[sourceParentId];
      const destSubItems = itemSubItemMap[destParentId];

      let newItems = [...items];

      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(sourceSubItems, sourceIndex, destIndex);
        newItems = newItems.map((item) => {
          if (item.id === sourceParentId) {
            item.subItems = reorderedSubItems;
          }
          return item;
        });
      } else {
        let newSourceSubItems = [...sourceSubItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

        let newDestSubItems = [...destSubItems];
        newDestSubItems.splice(destIndex, 0, draggedItem);
        newItems = newItems.map((item) => {
          if (item.id === sourceParentId) {
            item.subItems = newSourceSubItems;
          } else if (item.id === destParentId) {
            item.subItems = newDestSubItems;
          }
          return item;
        });
      }
      setItems(newItems);
    }
  };

  return (
    <>
      
      
      <h1>Vite + React</h1>
      

      <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" type="droppableItem">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            >
              {console.log(items)}
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.content}
                      <span
                        {...provided.dragHandleProps}
                        style={{
                          display: "inline-block",
                          margin: "0 10px",
                          border: "1px solid #000",
                        }}
                      >
                        Drag
                      </span>
                      <SubItemsComponent
                        subItems={item.subItems}
                        type={item.id.toString()}
                        updateSubItemContent={updateSubItemContent}
                      />
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>



    </>
  )
}

export default App
