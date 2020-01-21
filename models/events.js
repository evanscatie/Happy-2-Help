const db = require('./connection');

// --- LIST ALL EVENTS (Browse Events)
async function listEvents(){
    const allEvents = await db.any(`
    select * from events`);
    console.log(allEvents); 
    return allEvents;
}


// Format Events for User


// -- RETRIEVE ONE EVENT 
async function oneEvent(eventID) {
    try {
        const oneEvent = await db.one(`select * from events where event_id=$1`, [eventID]);
        console.log(`event_id = ${oneEvent.event_id}`)
        return oneEvent;
    } catch (err) {
        return null;
    }
}


// --- RETRIEVE EVENT TASK INFO
async function getTasks(eventID) {
    try {
        const tasksForEvent = await db.any(`select * from tasks where event_id=$1`, [eventID]);
        console.log(`tasksForEvent = ${tasksForEvent}`)
        return tasksForEvent;
    } catch (err) {
        return null;
    }
}




// --- CREATE AN EVENT 
// Step 1: Create Event Overview
    // Assigns event to user(creator) in events table
async function createEvent(eventName, eventLocation, eventDate, eventTime, eventDescription, userID){
    const result = await db.one(`
        insert into events
            (event_name, event_location, event_date, event_time, event_description, user_id)
        values ($1, $2, $3, $4, $5, $6)
        returning event_id
    `, [eventName, eventLocation, eventDate, eventTime, eventDescription, userID]);

    console.log(`event_id = ${result.event_id}`)
    return result.event_id;
}
// Step 2: Create Event Tasks
    // Assigns task to event in task table
async function createTask(taskList,eventID){
    for (const task of taskList) {
        const result = await db.one(`
            insert into tasks
                (task, event_id)
            values ($1, $2)
            returning task_id
        `, [task, eventID]);
    
        console.log(`task_id = ${result.task_id}`)
        // return result.task_id;
    }
}

// --- ASSIGN TASK TO USER
async function assignUserToTask(taskID,userID){
    const result = await db.one(`
        insert into task_assignment
            (task_id, user_id)
        values ($1, $2)
        returning *
    `, [taskID, userID]);
    console.log('Task is assigned to user:')
    console.log(result)
    return result
}
 





// --- VIEW YOUR EVENTS








// EXPORTS
module.exports= {
    listEvents,
    createEvent,
    createTask,
    oneEvent,
    getTasks,
    assignUserToTask
}