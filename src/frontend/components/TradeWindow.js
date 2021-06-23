import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Items from 'config/Items';
import classNames from 'classnames/bind';
import ItemIcon from 'components/ItemIcon';
import ProfilePic from 'components/ProfilePic';


function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [moved_item] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, moved_item);

    return result;
};

function parse_id(id) {
    const [listname, ind] = id.split('_');
    return [listname, +ind];
}

/**
 * Moves an item from one list to another list.
 */
function move(source, destination, droppableSource, droppableDestination) {
    const sourceClone = Array.from(source);
    const [moved_item] = sourceClone.splice(droppableSource.index, 1);

    return [sourceClone, insert(moved_item, destination, droppableDestination)];
};

function remove(source, droppableSource) {
    const sourceClone = Array.from(source);
    sourceClone.splice(droppableSource.index, 1);

    return sourceClone;
};

function insert (item, destination, droppableDestination) {
    const destClone = Array.from(destination);

    // If the item already exist, just increas the quantity
    for (const i of destClone) {
        if (i.item_id == item.item_id) {
            i.quantity += item.quantity;
            return destClone;
        }
    }
  
    // Otherwise, add the item to the list
    destClone.splice(droppableDestination.index, 0, item);
    return destClone;
};

function get_item_id(draggableId) {
    const parts = draggableId.split('_');
    return +parts[parts.length - 1];
}

export default function TradeWindow({npc, submit_trade_callback}) {
    const [trade, setTrade] = useState({'offers': [], 'desires': []});

    function onDragEnd(result) {
        const { source, destination, draggableId } = result;

        // dropped somewhere outside of the lists
        if (!destination || destination.droppableId == 'all_items') {
            if (source.droppableId != 'all_items') {
                let [sListname, sInd] = parse_id(source.droppableId);
                const newTrade = {'offers': [...trade.offers], 'desires': [...trade.desires]};
                newTrade[sListname][sInd] = remove(trade[sListname][sInd], source);
                
                newTrade[sListname] = newTrade[sListname].filter(group => group.length);
                setTrade(newTrade);
            }
            return;
        }

        let [dListname, dInd] = parse_id(destination.droppableId)

        if (source.droppableId == 'all_items') {
            // If moved to a new group, create it first
            if (dInd == -1) {
                trade[dListname].push([]);
                dInd = trade[dListname].length - 1; 
            }

            const destResult = insert({item_id: get_item_id(draggableId), quantity: 1}, trade[dListname][dInd], destination);
            const newTrade = {'offers': [...trade.offers], 'desires': [...trade.desires]};
            newTrade[dListname][dInd] = destResult;
            
            newTrade[dListname] = newTrade[dListname].filter(group => group.length);
            setTrade(newTrade);
        }
        else {
            let [sListname, sInd] = parse_id(source.droppableId)

            if (sListname == dListname && sInd === dInd) {
                const items = reorder(trade[sListname][sInd], source.index, destination.index);
                const newTrade = {'offers': [...trade.offers], 'desires': [...trade.desires]};
                newTrade[sListname][sInd] = items;
                setTrade(newTrade);
            } else {
                // If moved to a new group, create it first
                if (dInd == -1) {
                    trade[dListname].push([]);
                    dInd = trade[dListname].length - 1; 
                }

                const [sourceResult, destResult] = move(trade[sListname][sInd], trade[dListname][dInd], source, destination);
                const newTrade = {'offers': [...trade.offers], 'desires': [...trade.desires]};
                newTrade[sListname][sInd] = sourceResult;
                newTrade[dListname][dInd] = destResult;
                
                newTrade[sListname] = newTrade[sListname].filter(group => group.length);
                newTrade[dListname] = newTrade[dListname].filter(group => group.length);
                setTrade(newTrade);
            }
        }
    }

    function render_group(listname, el, ind) {
        return <Droppable key={listname + ind} droppableId={`${listname}_${ind}`}>
        {(provided, snapshot) => (
            <div
            ref={provided.innerRef}
            className={classNames('droppable', {draggingOver: snapshot.isDraggingOver})}
            {...provided.droppableProps}
            >
            {el.map((item, index) => (
                <Draggable
                key={item.item_id}
                draggableId={`${listname}_${ind}_${item.item_id}`}
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
                        <ItemIcon item_id={item.item_id} disabled={!is_permitted(item.item_id)} />
                        <span>{item.quantity}</span>
                        <div className="hidden_btns">
                            <a
                                onClick={() => {
                                    const newTrade = {'offers': [...trade.offers], 'desires': [...trade.desires]};
                                    newTrade[listname][ind][index].quantity++;
                                    if (newTrade[listname][ind][index].quantity > 99) {
                                        newTrade[listname][ind][index].quantity = 99;
                                    }
                                    setTrade(newTrade);
                                }}
                            >+</a>
                            <a
                                onClick={() => {
                                    const newTrade = {'offers': [...trade.offers], 'desires': [...trade.desires]};
                                    newTrade[listname][ind][index].quantity--;
                                    if (newTrade[listname][ind][index].quantity <= 0) {
                                        newTrade[listname][ind].splice(index, 1);
                                        newTrade[listname] = newTrade[listname].filter(group => group.length)
                                    }
                                    setTrade(newTrade);
                                }}
                            >-</a>
                        </div>
                    </div>
                )}
                </Draggable>
            ))}
            {provided.placeholder}
            </div>
        )}
        </Droppable>
    }

    function is_permitted(item_id) {
        return npc.permitted_items?.indexOf(+item_id) != -1;
    }

    return (
        <div id="trade_window">
            <div id='left_sidebar'>
                <ProfilePic npc={npc} />
                <div className="bordered_window">
                    <a className='button' href='{npc.src_url}'>{npc.name}</a>
                    <a onClick={() => {submit_trade_callback(trade)}} className="button">Submit Trade</a>
                    <a onClick={_ => {
                        const trade = prompt('Enter your trade json');
                        if (!trade) return;
                        setTrade(JSON.parse(trade));
                    }} className="button">Import</a>
                    <a onClick={_ => {
                        alert(JSON.stringify(trade));
                    }} className="button">Export</a>
                </div>
            </div>
            <div id='right_sidebar' className="bordered_window">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div id="offers">
                        <span>Im willing to give:</span>
                        <div className="bottom">
                            {trade.offers.map((el, ind) => render_group('offers', el, ind))}
                            <Droppable droppableId={`offers_-1`}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        className={classNames('droppable', {draggingOver: snapshot.isDraggingOver})}
                                        {...provided.droppableProps}
                                    >
                                        +
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                    <div id="desires">
                        <span>I want in return:</span>
                        <div className="bottom">
                            {trade.desires.map((el, ind) => render_group('desires', el, ind))}
                            <Droppable droppableId={`desires_-1`}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        className={classNames('droppable', {draggingOver: snapshot.isDraggingOver})}
                                        {...provided.droppableProps}
                                    >
                                        +
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
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
