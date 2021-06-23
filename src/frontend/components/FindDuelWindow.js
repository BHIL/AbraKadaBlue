import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Items from 'config/Items';
import classNames from 'classnames/bind';
import ItemIcon from 'components/ItemIcon';
import ProfilePic from 'components/ProfilePic';


export default function FindDuelWindow({npc, submit_duel_offer_callback}) {
    const [risked_item, setRiskedItem] = useState(null);
    const [desired_item, setDesiredItem] = useState(null);

    function onDragEnd(result) {
        const { source, destination, draggableId } = result;
        
        // dropped somewhere outside of the lists
        if (!destination || destination.droppableId == 'all_items') {
            return;
        }

        if (destination.droppableId == 'risked') {
            setRiskedItem(draggableId);
        }
        else {
            setDesiredItem(draggableId);
        }
    }

    function is_permitted(item_id) {
        return npc.permitted_items?.indexOf(+item_id) != -1;
    }

    return (
        <div id="find_duel_window">
            <div id='left_sidebar'>
                <ProfilePic npc={npc} />
                <div className="bordered_window">
                    <a onClick={() => {if (risked_item && desired_item) submit_duel_offer_callback(risked_item, desired_item)}} className={classNames('button', {'disabled': !risked_item || !desired_item})} >Find Duel</a>
                </div>
            </div>
            <div id='right_sidebar' className="bordered_window">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={'desired'}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                className={classNames('droppable', {draggingOver: snapshot.isDraggingOver})}
                                {...provided.droppableProps}
                            >
                                <span>If I win:</span>
                                <ItemIcon item_id={desired_item} disabled={!is_permitted(desired_item)} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId={'risked'}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                className={classNames('droppable', {draggingOver: snapshot.isDraggingOver})}
                                {...provided.droppableProps}
                            >
                                <span>If I lose:</span>
                                <ItemIcon item_id={risked_item} disabled={!is_permitted(risked_item)} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div id="all_items">
                        <span>Drag an item:</span>
                        <Droppable
                            droppableId="all_items"
                            renderClone={(provided, snapshot, rubric) => (
                                <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="dragging_item"
                                >
                                <ItemIcon item_id={rubric.draggableId} disabled={!is_permitted(rubric.draggableId)} />
                                </div>
                            )}
                            >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {Object.keys(Items).map((item_id, index) => (
                                        <Draggable
                                            key={item_id}
                                            draggableId={item_id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                            <div
                                                className="draggable"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={provided.draggableProps.style}
                                            >
                                                <div>
                                                    <ItemIcon item_id={item_id} disabled={!is_permitted(item_id)} />
                                                </div>
                                            </div>
                                            )}
                                        </Draggable>
                                    )) }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}
