import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  Progress,
  Row,
  Col,
} from 'reactstrap'

import '../styles/Lineup.css'

// fake data generator
const getItems = (count, offset = 0) => Array.from({ length: count }, (v, k) => k).map(k => ({
  id: `item-${k + offset}`,
  content: `item ${k + offset}`,
}))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

const grid = 8

const getBase = index => (
  (index < 2) ? 'white' : 'grey'
)

const getItemStyle = (isDragging, draggableStyle, idx) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : getBase(idx),

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
})

const Lineup = () => {
  // TODO refactor state to something like this
  // const [items, setItems] = useState({
  //   east: [],
  //   west: [],
  //   pending: [],
  // })
  const [sports, setSports] = useState([])
  const [random, setRandom] = useState(getItems(5))

  const onDragEnd = (result) => {
    const { source, destination } = result

    // dropped outside the list
    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) { // move items in same list
      if (source.droppableId === 'sports') {
        const s = reorder(
          sports,
          source.index,
          destination.index,
        )
        setSports(s)
      }
      if (source.droppableId === 'random') {
        const r = reorder(
          random,
          source.index,
          destination.index,
        )
        setRandom(r)
      }
    } else { // move from one list to another
      const srcArr = (source.droppableId === 'sports') ? sports : random
      const destArr = (source.droppableId === 'sports') ? random : sports
      const res = move(
        srcArr,
        destArr,
        source,
        destination,
      )

      setSports(res.sports)
      setRandom(res.random)
    }
  }

  useEffect(
    () => {
      if (sports.length === 0) {
        const uri = '/api'
        fetch(uri)
          .then(response => response.json())
          .then((payload) => {
            const arr = payload.sports.map(s => ({ id: s, content: s }))
            const i = reorder(arr, 0, 0)
            setSports(i)
          })
      }
    },
    [sports],
  )

  if (sports.length === 0) {
    return (
      <div id="lineup-loader">
        <Progress animated color="success" value="25" />
      </div>
    )
  }

  return (
    <Row>
      <DragDropContext onDragEnd={onDragEnd}>
        <Col sm={{ size: 4 }}>
          <Droppable droppableId="sports">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {sports.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  >
                    {(provide, snap) => (
                      <div
                        ref={provide.innerRef}
                        {...provide.draggableProps}
                        {...provide.dragHandleProps}
                        style={getItemStyle(
                          snap.isDragging,
                          provide.draggableProps.style,
                          index,
                        )}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Col>
        <Col sm={{ size: 4 }}>
          <Droppable droppableId="random">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {random.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  >
                    {(provide, snap) => (
                      <div
                        ref={provide.innerRef}
                        {...provide.draggableProps}
                        {...provide.dragHandleProps}
                        style={getItemStyle(
                          snap.isDragging,
                          provide.draggableProps.style,
                          index,
                        )}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Col>
      </DragDropContext>
    </Row>
  )
}

export default Lineup
