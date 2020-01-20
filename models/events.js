const db = require('./connection');

// --- LIST ALL EVENTS (Browse Events)
async function listEvents(){
    const allEvents = await db.any(`
    select event_name, event_location, event_date, event_time, event_description, user_id from events`);
    console.log(allEvents); 
    return allEvents;
}

// Format Events for User




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

// --- VIEW YOUR EVENTS



// --- SIGN UP FOR TASK
    // Assigns task to user(participant) in task_assignment table

async function assignTask(taskID,userID){
        const result = await db.one(`
            insert into tasks
                (taskID, userID)
            values ($1, $2)
            returning task_id
        `, [task, eventID]);
    
        console.log(`task_id = ${result.task_id}`)
        // return result.task_id;
}





// EXPORTS
module.exports= {
    listEvents,
    createEvent,
    createTask,
}