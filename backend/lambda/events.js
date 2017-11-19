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