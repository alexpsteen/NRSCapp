//////// EVENTS

function handleEventsGET (httpEvent, context) {
  /**
   * I have two functions below that will use the path:
   * events/taskType/id
   * and get the taskType and id from it.
   * TaskTypes include: customer, eventPlanner, event, inProgress, completed and all
   * Select SQL statement based on what TaskType and then run it.
   * */

  const taskType = getTaskType(httpEvent.path);
  const id = getId(httpEvent.path);
  let q;
  console.log("task type");
  console.log(taskType);
  console.log("id", id);
  if(taskType == "customer") {
    q = 'SELECT e.* FROM event e, user u WHERE e.customer_id = u.user_id AND u.authentication_id = ?';
    const inserts = [httpEvent.requestContext.identity.cognitoIdentityId];
    q = mysql.format(q, inserts);
  } else if(taskType == "all") {
    q = 'SELECT * FROM event';
  } else if(taskType == "event") {
    q = 'SELECT * FROM event WHERE event_id = ?';
    const inserts = [id];
    q = mysql.format(q, inserts);
  } else if(taskType == "eventPlanner") {
    q = 'SELECT e.* FROM event e, user u WHERE e.event_planner_id = u.user_id AND u.authentication_id = ?';
    const inserts = [httpEvent.requestContext.identity.cognitoIdentityId];
    q = mysql.format(q, inserts);
  } else if(taskType == "completed") {
    q = 'SELECT * FROM event WHERE event_status = 1';
  } else if(taskType == "inProgress") {
    q = 'SELECT * FROM event WHERE event_status = 0';
  }
  runFinalQuery(context, q);
}

function handleEventsPOST (httpEvent, context) {
  const customer_id = getId(httpEvent.path);
  let event = JSON.parse(httpEvent.body);
  let q = 'INSERT INTO event (customer_id, event_name, event_status, event_budget, event_date_start, event_date_end) SELECT user_id, ?, ?, ?, ?, ? FROM user WHERE authentication_id = ?';
  const inserts = [event.event_name, 0, event.event_budget, event.event_date_start, event.event_date_end, httpEvent.requestContext.identity.cognitoIdentityId];
  q = mysql.format(q, inserts);
  runFinalQuery(context, q);

}

function handleEventsPUT (httpEvent, context) {
  const taskType = getTaskType(httpEvent.path);
  const eventId = getId(httpEvent.path);
  let q = 'UPDATE event SET ';
  let inserts = [];
  if(taskType == 'editProfile') {
    let event = JSON.parse(httpEvent.body);
    q +=  'event_name = ?, event_date_start = ?, event_date_end = ?, event_budget = ?';
    inserts.push(event.event_name);
    inserts.push(event.event_date_start);
    inserts.push(event.event_date_end);
    inserts.push(event.event_budget);
    inserts.push(eventId);
  } else if(taskType == 'assignEventPlanner') {
    const eventPlannerId = getAdditional(httpEvent.path);
    q += 'event_planner_id = ?'
    inserts = [eventPlannerId, eventId];
  } else if(taskType == 'completeEvent') {
    q += 'event_status = ?';
    inserts = [1, eventId];
  }
  q += ' WHERE event_id = ?';
  q = mysql.format(q, inserts);
  runFinalQuery(context, q);
}

function handleEventsDELETE (httpEvent, context) {
  console.log("DELETE not implemented yet");
  successResponse(context, {});
}

function getId (path) {
  const matches = path.match(/events\/\w*\/(\d*)\/?/);
  if(matches) {
    return matches[1];
  } else {
    return null;
  }
}

function getAdditional (path) {
  const matches = path.match(/events\/\w*\/\d*\/(\w*)\/?/);
  if(matches) {
    return matches[1];
  } else {
    return null;
  }
}

function getTaskType (path) {
  const matches = path.match(/events\/(\w*)\/?/);
  if(matches) {
    return matches[1];
  } else {
    return null;
  }
}