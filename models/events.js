const db = require('./connection');

// --- LIST ALL EVENTS (Browse Events)
async function listEvents(){
    const allEvents = await db.any(`
    select * from events`);
    console.log(allEvents); 
    return allEvents;
}


// -- RETRIEVE ONE EVENT (Browse Events)
async function oneEvent(eventID) {
    try {
        const oneEvent = await db.one(`select * from events where event_id=$1`, [eventID]);
        console.log(`event_id = ${oneEvent.event_id}`)
        return oneEvent;
    } catch (err) {
        return null;
    }
}


// --- RETRIEVE EVENT TASK INFO (Browse Events)
async function getTasks(eventID) {
    try {
        const tasksForEvent = await db.any(`select * from tasks where event_id=$1`, [eventID]);
        console.log(`tasksForEvent = ${tasksForEvent}`)
        return tasksForEvent;
    } catch (err) {
        return null;
    }
}


//  --- RETRIEVE USERS EVENTS (CREATORS)
async function listCreatorEvents(userID){
    const allCreatorEvents = await db.any(`
    select * from events where user_id=$1`,
    [userID]);
    console.log(allCreatorEvents); 
    return allCreatorEvents;
}





// --- RETRIEVE USERS TASKS AND THEIR EVENTS(PARTICIPANT)
async function listParticipantTasks(userID) {
    try {
        const allParticipantTasks = await db.any(`SELECT distinct events.event_id, events.event_name, events.event_description, events.event_time, events.event_date, events.event_image
        FROM task_assignment
        INNER JOIN tasks ON tasks.task_id = task_assignment.task_id
        INNER JOIN events ON events.event_id = tasks.event_id
        WHERE task_assignment.user_id = $1`, [userID]);
        console.log(`allParticipantTasks = `)
        console.log(allParticipantTasks)
        return allParticipantTasks;
    } catch (err) {
        console.log(err);
    }
}


// --- RETRIEVE EVENT TASK INFO (Browse Events)
async function getAllTasksForUser(eventID, userID) {
    try {
        const tasksForEvent = await db.any(`SELECT tasks.task_id, task, event_id
        FROM task_assignment
        JOIN tasks ON tasks.task_id = task_assignment.task_id 
        WHERE user_id = $1 AND event_id = $2`, [userID, eventID]);
        console.log(`tasksForEvent = ${tasksForEvent}`)
        return tasksForEvent;
    } catch (err) {
        console.log(err);
    }
}

async function formatParticipantEventCards(events, userID) {
    const eventsWithTasks = await Promise.all(events.map(async (event) => {
        console.log('----- EVENT -----')
        console.log(event)
        const tasks = await getAllTasksForUser(event.event_id, userID);
        console.log('----- END EVENT -----')
        return {
          // a brand new object!
      
          // but with all the stuff from the `event`
          ...event,
      
          // attach the tasks
          tasks    
        };
      }));
      
      console.log('----- EVENTS WITH TASKS -----')
      console.log(eventsWithTasks)
      return eventsWithTasks

    }

// --- DELETE TASK

async function deleteParticipantTask(taskID, userID) {
    try {
        db.none(`delete from task_assignment where task_id=$1 AND user_id=$2`, [taskID, userID]);
    } catch (err) {
        console.log(err)
    }
}

    
  
  





// --- CREATE AN EVENT 
// Step 1: Create Event Overview
    // Assigns event to user(creator) in events table
async function createEvent(eventName, eventLocation, eventDate, eventTime, eventDescription, eventImage, userID){
    const result = await db.one(`
        insert into events
            (event_name, event_location, event_date, event_time, event_description, event_image, user_id)
        values ($1, $2, $3, $4, $5, $6, $7)
        returning event_id
    `, [eventName, eventLocation, eventDate, eventTime, eventDescription, eventImage, userID]);

    console.log(`event_id = ${result.event_id}`)
    return result.event_id;
}
// Step 2: Create Event Tasks
    // Assigns task to event in task table
async function createTask(taskList,eventID){
    if (Array.isArray(taskList)) {
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
        } else {
            const result = await db.one(`
            insert into tasks
                (task, event_id)
            values ($1, $2)
            returning task_id
        `, [taskList, eventID]);
    
        console.log(`task_id = ${result.task_id}`)
        // return result.task_id;
    }
}

// --- ASSIGN TASK TO USER
async function assignUserToTask(taskID,userID) {
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


// --- UPDATE EVENT (CREATOR)
function updateEvent(eventName, eventLocation, eventDate, eventTime, eventDescription, userID){
        try {
            db.result(`
            update events set 
            event_name=$1, event_location=$2, event_date=$3, event_time=$4, event_description=$5, user_id=$6
        `, [eventName, eventLocation, eventDate, eventTime, eventDescription, userID]);
        } catch (err) {
            console.log(err)
        }
    
}



// EXPORTSs
module.exports= {
    listEvents,
    createEvent,
    createTask,
    oneEvent,
    getTasks,
    assignUserToTask,
    listCreatorEvents,
    listParticipantTasks,
    formatParticipantEventCards,
    deleteParticipantTask,
    updateEvent

}