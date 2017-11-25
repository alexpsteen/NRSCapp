//////// EVENTS

function handleEventsGET (httpEvent, context) {
    /**
     * I have two functions below that will use the path:
     * events/userType/userId
     * and get the userType and userId from it.
     * UserTypes include: customer, eventPlanner, event, inProgress, completed and all
     * (Special case: event is not a User but it does have a specific id)
     * Select SQL statement based on what UserType and then run it.
     * */

    const userType = getUserType(httpEvent.path);
    const userId = getUserId(httpEvent.path);
    let q;
    if(userType == "customer") {
        q = 'SELECT * FROM event WHERE user_id = ?';
        const inserts = [userId];
        q = mysql.format(q, inserts);
    } else if(userType == "all") {
        q = 'SELECT * FROM event';
    } else if(userType == "event") {
        q = 'SELECT * FROM event WHERE event_id = ?';
        const inserts = [userId];
        q = mysql.format(q, inserts);
    } else if(userType == "eventPlanner") {
        q = 'SELECT * FROM event WHERE event_planner_id = ?';
        const inserts = [userId];
        q = mysql.format(q, inserts);
    } else if(userType == "completed") {
        q = 'SELECT * FROM event WHERE event_status = 1';
    } else if(userType == "inProgress") {
        q = 'SELECT * FROM event WHERE event_status = 0';
    }
    runFinalQuery(context, q);
}

function handleEventsPOST (httpEvent, context) {
    const customer_id = getUserId(httpEvent.path);
    let event = JSON.parse(httpEvent.body);
    let q = 'INSERT INTO event SET customer_id = ?, event_planner_id = ?, event_name = ?, event_status = ?, event_budget = ?, event_description = ?, event_date_start = ?, event_date_end = ?'
    const inserts = [customer_id, "", event.name, 0, event.budget, event.description, event.date_start, event.date_end];
    q = mysql.format(q, inserts);
    runFinalQuery(context, q);

}

function handleEventsPUT (httpEvent, context) {
    console.log("PUT not implemented yet");
    successResponse(context, {});
}

function handleEventsDELETE (httpEvent, context) {
    console.log("DELETE not implemented yet");
    successResponse(context, {});
}

function getUserId (path) {
    const matches = path.match(/events\/(.*)\/?/);
    if(matches) {
        return matches[2];
    } else {
        return null;
    }
}

function getUserType (path) {
    const matches = path.match(/events\/(.*)\/?/);
    if(matches) {
        return matches[1];
    } else {
        return null;
    }
}