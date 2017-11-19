'use strict';
const AWS = require('aws-sdk');
let doc = new AWS.DynamoDB.DocumentClient();
const tasksTable = process.env.TASKS_TABLE;
const projectsTable = process.env.PROJECTS_TABLE;
const eventsTable = process.env.EVENTS_TABLE;
const featuresTable = process.env.FEATURES_TABLE;

const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_pw = process.env.DB_PW;

const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : db_host,
  user     : db_user,
  password : db_pw,
  database : db_name
});

console.log('Loading function');

exports.handler = function (event, context, callback) {
  console.log('request: ' + JSON.stringify(event));
  handleHttpMethod(event, context);
};

function runQuery(query) {
  try {
    console.log('about to connect');
    connection.connect((err) => {
      console.log('did that connect');
      if (!err) {
        console.log('no err, continuing...');
        connection.query(query,
            function(err, results) {
              console.log('ran query: ', query);
              if (!err) {
                console.log('results: ', JSON.stringify(results));
                connection.end();
                context.succeed({ statusCode: 200, body: JSON.stringify(results),
                  headers: { 'Access-Control-Allow-Origin': '*' } });
              } else {
                console.log('Query error!: ');
                context.fail('prob with query i guess');
              }
            });

      } else {
        console.log("Error connecterating database ...", err.message);
        context.fail('connect prob');
      }

    });
  } catch (error) {
    context.fail(`Exception caught: ${error}`);
  }
}

function handleHttpMethod (event, context) {
  let httpMethod = event.httpMethod;
  if (event.path.match(/^\/tasks/)) {
    if (httpMethod === 'GET') {
      return handleTasksGET(event, context);
    } else if (httpMethod === 'POST') {
      return handleTasksPOST(event, context);
    } else if (httpMethod === 'PUT') {
      return handleTasksPUT(event, context);
    } else if (httpMethod === 'DELETE') {
      return handleTasksDELETE(event, context);
    }
  } else if (event.path.match(/^\/projects/)) {
    if (httpMethod === 'GET') {
      return handleProjectsGET(event, context);
    }
  } else if (event.path.match(/^\/events/)) {
    if (httpMethod === 'GET') {
      return handleEventsGET(event, context);
    } else if (httpMethod === 'POST') {
      return handleEventsPOST(event, context);
    } else if (httpMethod === 'PUT') {
      return handleEventsPUT(event, context);
    } else if (httpMethod === 'DELETE') {
      return handleEventsDELETE(event, context);
    }
  } else if (event.path.match(/^\/features/)) {
    if (httpMethod === 'GET') {
      return handleFeaturesGET(event, context);
    } else if (httpMethod === 'POST') {
      return handleFeaturesPOST(event, context);
    } else if (httpMethod === 'PUT') {
      return handleFeaturesPUT(event, context);
    } else if (httpMethod === 'DELETE') {
      return handleFeaturesDELETE(event, context);
    }
  }
  return errorResponse(context, 'Unhandled http method:', httpMethod);
}

//////// EVENTS

function handleEventsGET (event, context) {
  const eventId = getEventId(event.path);
  console.log(eventId);
  let params = {
    TableName: eventsTable
  };
  if (eventId === 'all') {
    const statusId = +event.queryStringParameters.status;
    params.IndexName = 'eventStatus_idx';
    params.KeyConditionExpression = 'eventStatus = :statusId';
    params.ExpressionAttributeValues = {':statusId': statusId};
  } else {
    params.KeyConditionExpression = 'userId = :key';
    params.ExpressionAttributeValues = {':key': event.requestContext.identity.cognitoIdentityId};
    if (eventId) {
      params.KeyConditionExpression += ' and eventId = :eventKey';
      params.ExpressionAttributeValues[':eventKey'] = eventId;
    }
  }
  console.log('GET query: ', JSON.stringify(params));
  doc.query(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error getting events ', err.message) }
    return successResponse(context, {events: data.Items});
  })
}

function handleEventsPOST (httpEvent, context) {
  let event = JSON.parse(httpEvent.body);
  if (!event || !event.eventId) { return errorResponse(context, 'Error: no eventId found') }
  event.userId = httpEvent.requestContext.identity.cognitoIdentityId;
  let params = {
    TableName: eventsTable,
    Item: event
  };

  console.log('Inserting event', JSON.stringify(event));
  doc.put(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not add event', err.message) }
    console.log('After insert promise', data);
    let retEvent = null;
    if (data && data.Attributes) {
      retEvent = data.Attributes;
    } else {
      retEvent = event;
    }
    return successResponse(context, {event: retEvent});
  });
}

function handleEventsPUT (httpEvent, context) {
  let event = JSON.parse(httpEvent.body);
  console.log('updating event [' + event.eventId + ']');
  let eventId = getEventId(httpEvent.path);
  if (!event || !eventId) { return errorResponse(context, 'Error: no eventId found') }
  let params = {
    TableName: eventsTable,
    Item: event,
  };

  console.log('Updating event', JSON.stringify(params));
  doc.put(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not update event', err.message) }
    console.log('After insert promise', data);
    let retEvent = null;
    if (data && data.Attributes) {
      retEvent = data.Attributes;
    } else {
      retEvent = event;
    }
    return successResponse(context, {event: retEvent});
  });
}

function handleEventsDELETE (httpEvent, context) {
  const eventId = getEventId(httpEvent.path);
  if (!eventId) { return errorResponse(context, 'Error: no eventId found') }
  let params = {
    TableName: eventsTable,
    Key: {
      userId: httpEvent.requestContext.identity.cognitoIdentityId,
      eventId: eventId
    },
    ReturnValues: 'ALL_OLD'
  };

  console.log('Deleting event', JSON.stringify(params));
  doc.delete(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not delete event', err.message) }
    return successResponse(context, {event: data.Attributes});
  });
}

function getEventId (path) {
  const matches = path.match(/events\/(.*)\/?/);
  if (matches) {
    return matches[1];
  } else {
    return null;
  }
}

//////// FEATURES

function handleFeaturesGET (feature, context) {
  const featureId = getFeatureId(feature.path);
  let params = {
    TableName: featuresTable,
    KeyConditionExpression: 'userId = :key',
    ExpressionAttributeValues: { ':key': feature.requestContext.identity.cognitoIdentityId }
  };
  if (eventId === 'event') {
    params.KeyConditionExpression += ' and featureId = :featureKey';
    params.ExpressionAttributeValues[':featureKey'] = event.queryStringParameters.id;
  } else {
    params.KeyConditionExpression += ' and eventId = :eventKey';
    params.ExpressionAttributeValues[':eventKey'] = eventId;
  }
  console.log('GET query: ', JSON.stringify(params));
  doc.query(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error getting features ', err.message) }
    return successResponse(context, {features: data.Items});
  })
}

function handleFeaturesPOST (httpEvent, context) {
  let feature = JSON.parse(httpEvent.body);
  if (!feature || !feature.featureId) { return errorResponse(context, 'Error: no featureId found') }
  feature.userId = httpEvent.requestContext.identity.cognitoIdentityId;
  let params = {
    TableName: featuresTable,
    Item: feature
  };

  console.log('Inserting feature', JSON.stringify(feature));
  doc.put(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not add feature', err.message) }
    console.log('After insert promise', data);
    let retFeature = null;
    if (data && data.Attributes) {
      retFeature = data.Attributes;
    } else {
      retFeature = feature;
    }
    return successResponse(context, {feature: retFeature});
  });
}

function handleFeaturesPUT (httpEvent, context) {
  let feature = JSON.parse(httpEvent.body);
  console.log('updating feature [' + feature.featureId + ']');
  let featureId = getFeatureId(httpEvent.path);
  if (!feature || !featureId) { return errorResponse(context, 'Error: no featureId found') }
  let params = {
    TableName: featuresTable,
    Key: {
      userId: httpEvent.requestContext.identity.cognitoIdentityId,
      featureId: feature.featureId
    },
    UpdateExpression: 'set #a = :val1, #b = :val2, #c = :val3',
    ExpressionAttributeNames: {'#a': 'type', '#b': 'additionalDetails', '#c': 'location'},
    ExpressionAttributeValues: {':val1': feature.type, ':val2': feature.additionalDetails, ':val3': feature.location},
    ReturnValues: 'ALL_NEW'
  };

  console.log('Updating feature', JSON.stringify(params));
  doc.update(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not update feature', err.message) }
    return successResponse(context, {feature: data.Attributes});
  });
}

function handleFeaturesDELETE (httpEvent, context) {
  const featureId = getFeatureId(httpEvent.path);
  if (!featureId) { return errorResponse(context, 'Error: no featureId found') }
  let params = {
    TableName: featuresTable,
    Key: {
      userId: httpEvent.requestContext.identity.cognitoIdentityId,
      featureId: featureId
    },
    ReturnValues: 'ALL_OLD'
  };

  console.log('Deleting feature', JSON.stringify(params));
  doc.delete(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not delete feature', err.message) }
    return successResponse(context, {feature: data.Attributes});
  });
}

function getFeatureId (path) {
  const matches = path.match(/features\/(.*)/);
  if (matches) {
    return matches[1];
  } else {
    return null;
  }
}

function getFeatureEventId(path) {
  if (path.indexOf('eventId'))
  const matches = path.match(/features\/?event\/(.*)/);
  if (matches) {
    return matches[1];
  } else {
    return null;
  }
}

//////// PROJECTS

function handleProjectsGET (event, context) {
  doc.scan({ TableName: projectsTable }, (err, data) => {
    if (err) { return errorResponse(context, 'Error getting projects ', err.message) }
    return successResponse(context, {projects: data.Items})
  })
}

function updateProjectTable (task, action, callback) {
  let expressions = [];
  if (action === 'added') {
    expressions = [updateAddedCount(task, true)];
  } else if (action === 'completed') {
    expressions = [updateCompletedCount(task, true)];
  } else if (action === 'deleted') {
    expressions = [updateAddedCount(task, false)];
  }
  updateTable(expressions, callback);
}

function updateAddedCount (task, inc) {
  return {
    TableName: projectsTable,
    ExpressionAttributeNames: {'#a': 'added', '#b': 'completed'},
    ExpressionAttributeValues: {':val': inc ? 1 : -1, ':comp': inc ? 0 : task.completed ? -1 : 0},
    Key: {'projectId': task.project, 'month': task.createdOn.substr(0, 7)},
    UpdateExpression: 'ADD #a :val, #b :comp'
  };
}

function updateCompletedCount (task, inc) {
  return {
    TableName: projectsTable,
    ExpressionAttributeNames: {'#b': 'completed'},
    ExpressionAttributeValues: {':val': inc ? 1 : -1},
    Key: {'projectId': task.project, 'month': task.createdOn.substr(0, 7)},
    UpdateExpression: 'ADD #b :val'
  };
}

function updateTable (expressions, callback) {
  let params = expressions.shift();
  console.log('update projects table', params);
  doc.update(params, (err) => {
    if (err) { console.log('error updating projects table', err) }
    if (expressions.length) {
      updateTable(expressions, callback);
    } else {
      if (callback) { callback() }
    }
  });
}


//////// TASKS

function handleTasksGET (event, context) {
  let params = {
    TableName: tasksTable,
    KeyConditionExpression: 'userId = :key',
    ExpressionAttributeValues: { ':key': event.requestContext.identity.cognitoIdentityId }
  };

  console.log('GET query: ', JSON.stringify(params));
  doc.query(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: ', err) }
    return successResponse(context, {tasks: data.Items})
  });
}

function handleTasksPOST (event, context) {
  let task = JSON.parse(event.body);
  if (!task || !task.taskId) { return errorResponse(context, 'Error: no taskId found') }
  task.userId = event.requestContext.identity.cognitoIdentityId;
  let params = { TableName: tasksTable, Item: task };

  console.log('Inserting task', JSON.stringify(task));
  doc.put(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not add task', err.message) }
    updateProjectTable(task, 'added', () => successResponse(context, {task: task}))
  });
}

function handleTasksPUT (event, context) {
  let task = JSON.parse(event.body);
  let taskId = getTaskId(event.path);
  if (!task || !taskId) { return errorResponse(context, 'Error: no taskId found') }
  let params = {
    TableName: tasksTable,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      taskId: taskId
    },
    UpdateExpression: 'set #a = :val1, #b = :val2',
    ExpressionAttributeNames: {'#a': 'completed', '#b': 'completedOn'},
    ExpressionAttributeValues: {':val1': task.completed, ':val2': task.completedOn},
    ReturnValues: 'ALL_NEW'
  };

  console.log('Updating task', JSON.stringify(params));
  doc.update(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not update task', err.message) }
    updateProjectTable(data.Attributes, 'completed', () => successResponse(context, {task: data.Attributes}))
  });
}

function handleTasksDELETE (event, context) {
  let taskId = getTaskId(event.path);
  if (!taskId) { return errorResponse(context, 'Error: no taskId found') }
  let params = {
    TableName: tasksTable,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      taskId: taskId
    },
    ReturnValues: 'ALL_OLD'
  };

  console.log('Deleting task', JSON.stringify(params));
  doc.delete(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not delete task', err.message) }
    updateProjectTable(data.Attributes, 'deleted', () => successResponse(context, {task: data.Attributes}))
  });
}

function getTaskId (path) { return path.match(/tasks\/(.*)/)[1] }

function errorResponse (context, logline) {
  let response = { statusCode: 404, body: JSON.stringify({ 'Error': 'Could not execute request' }) };
  let args = Array.from(arguments).slice(1);
  console.log.apply(null, args);
  context.succeed(response);
}

function successResponse (context, body) {
  let response = { statusCode: 200, body: JSON.stringify(body), headers: { 'Access-Control-Allow-Origin': '*' } };
  console.log('response: ' + JSON.stringify(response));
  context.succeed(response);
}
