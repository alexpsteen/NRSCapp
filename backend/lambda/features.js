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