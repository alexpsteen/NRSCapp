//////// COMMON

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

console.log('Loading function');

exports.handler = function (event, context, callback) {
  console.log('request: ' + JSON.stringify(event));
  handleHttpMethod(event, context);
};

function runQuery(context, query) {
  const connection = mysql.createConnection({
    host     : db_host,
    user     : db_user,
    password : db_pw,
    database : db_name
  });
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