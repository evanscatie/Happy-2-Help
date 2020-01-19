const db = require('./connection');

// LIST ALL EVENTS (Browse Events)
async function listEvents(){
    const result = await db.any(`
    select * from events`);
    console.log(result);
    return result;
}

// CREATE AN EVENT 
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

    


// SIGN UP FOR TASK
    // Assigns task to user(participant) in task_assignment table


// EXPORTS
module.exports= {
    listEvents,
    createEvent,
    createTask
}