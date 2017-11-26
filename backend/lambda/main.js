//////// COMMON

'use strict';

const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_pw = process.env.DB_PW;

const mysql = require('mysql');
const pool = mysql.createPool({
  host: db_host,
  user: db_user,
  password: db_pw,
  database: db_name,
  connectionLimit: 10
});

console.log('Loading function');

exports.handler = function (event, context, callback) {
  console.log('request: ' + JSON.stringify(event));
  handleHttpMethod(event, context);
};

// BE CAREFUL! If you need more customized result, just use the same format here
function runFinalQuery(context, query) {
  try {
    console.log('running final query:', query);
    pool.query(query, function(err, results) {
      if (err) {
        console.log(`query error: ${err}`);
        throw err;
      }
      console.log('query success: ', results);

      successResponse(context, getResult(results));
    });
  } catch (error) {
    console.log(error);
    errorResponse(context, `Exception caught: ${error}`);
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
  } else if (event.path.match(/^\/users/)) {
    if (httpMethod === 'GET') {
      return handleUsersGET(event, context);
    } else if (httpMethod === 'POST') {
      return handleUsersPOST(event, context);
    } else if (httpMethod === 'PUT') {
      return handleUsersPUT(event, context);
    } else if (httpMethod === 'DELETE') {
      return handleUsersDELETE(event, context);
    }
  }
  return errorResponse(context, 'Unhandled http method:', httpMethod);
}

function getResult(results) {
  let res = null;
  if (!results) {
    return res;
  }

  if (results.affectedRows) {
    res = results.affectedRows;
  } else if (results.length === 1) {
    res = results[0];
  } else if (results.length === 0) {
    res = null;
  } else {
    res = results;
  }
  return res;
}

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