//////// USERS

function handleUsersGET (httpEvent, context) {
  let task = getTaskType(httpEvent.path);
  let params = httpEvent.queryStringParameters;
  let q;
  console.log('task type', task);
  if(task === "all") {
    if(params.type === "vendor") {
      q = 'SELECT v.*, u.* FROM vendor v, user u WHERE v.user_id = u.user_id';
      runFinalQuery(context, q);
    } else if(params.type === 'planner') {
      q = 'SELECT * FROM user WHERE user_type = 0';
      runFinalQuery(context, q);
    } else {
      errorResponse(context, 'bad user query');
    }
  } else {
    if(params.type === "self") {
      const cognitoId = httpEvent.requestContext.identity.cognitoIdentityId;
      q = 'SELECT * FROM user WHERE authentication_id = ?';
      const inserts = [cognitoId];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    } else if(params.type === "vendorSelf") {
      const cognitoId = httpEvent.requestContext.identity.cognitoIdentityId;
      q = 'SELECT v.*, u.* FROM vendor v, user u WHERE v.user_id = u.user_id and u.authentication_id = ?';
      const inserts = [cognitoId];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    } else if(params.type === "vendor") {
      q = 'SELECT v.*, u.* FROM vendor v, user u WHERE v.user_id = u.user_id and v.vendor_id = ?';
      const inserts = [params.id];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    } else if(params.type === 'any') {
      q = 'SELECT * FROM user WHERE user_id = ?';
      const inserts = [params.id];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    } else if(params.type === 'vendorLite') {
      q = 'SELECT * FROM vendor WHERE user_id = ?';
      const inserts = [params.id];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    }
  }

}

function handleUsersPOST (httpEvent, context) {
  console.log('Users POST');
  const cognitoId = httpEvent.requestContext.identity.cognitoIdentityId;
  const userObj = JSON.parse(httpEvent.body);
  const user = userObj.user;
  const vendor = userObj.vendor;
  let userQuery = 'INSERT INTO user SET user_type = ?, email = ?, authentication_id = ?, first_name = ?, last_name = ?, cellphone_number = ?';
  const inserts = [user.user_type, user.email, cognitoId, user.first_name, user.last_name, user.cellphone_number];
  userQuery = mysql.format(userQuery, inserts);
  if (vendor) {
    try {
      console.log('running user query:', userQuery);
      pool.query(userQuery, user, (error, results) => {
        if (error) {
          console.log('found err in q: ', error);
          throw error;
        }

        let userResult = getResult(results);
        let vendorInsert = 'INSERT INTO vendor SET user_id = ?, address = ?, description = ?, name = ?, approved = 0'
        const vendorInserts = [results.insertId, vendor.address, vendor.description, vendor.name];
        vendorInsert = mysql.format(vendorInsert, vendorInserts);
        console.log('running vendor query:', vendorInsert);
        pool.query(vendorInsert, user, (error2, results2) => {
          if (error2) {
            console.log('found err in q: ', error2);
            throw error2;
          }
          successResponse(context, userResult);
        });
      });
    } catch (err) {
      errorResponse(context, err);
    }
  } else {
    runFinalQuery(context, userQuery);
  }
}

function handleUsersPUT (httpEvent, context) {
  console.log('Users PUT');
  const params =  httpEvent.queryStringParameters;
  let q;
  if(params && params.type === "vendor") {
    if(params.task === "verify") {
      q = 'UPDATE vendor SET approved = 1 WHERE vendor_id = ?';
      const inserts = [params.id];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    } else if(params.task === "deactivate") {
      q = 'UPDATE vendor SET approved = 0 WHERE vendor_id = ?';
      const inserts = [params.id];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    }
  } else {
    const cognitoId = httpEvent.requestContext.identity.cognitoIdentityId;
    const userObj = JSON.parse(httpEvent.body);
    const user = userObj.user;
    const vendor = userObj.vendor;
    let userQuery = 'UPDATE user SET first_name = ?, last_name = ?, email = ?, cellphone_number = ? WHERE authentication_id = ?';
    const inserts = [user.first_name, user.last_name, user.email, user.cellphone_number, cognitoId];
    userQuery = mysql.format(userQuery, inserts);
    if (vendor) {
      try {
        console.log('running user query:', userQuery);
        pool.query(userQuery, user, (error, results) => {
          if (error) {
            console.log('found err in q: ', error);
            throw error;
          }

          let userResult = results[0];
          let vendorUpdate = 'UPDATE vendor SET address = ?, description = ?, name = ? WHERE vendor_id = ?'
          const vendorInserts = [vendor.address, vendor.description, vendor.name, vendor.vendor_id];
          vendorUpdate = mysql.format(vendorUpdate, vendorInserts);
          console.log('running vendor query:', vendorUpdate);
          pool.query(vendorUpdate, user, (error2, results2) => {
            if (error2) {
              console.log('found err in q: ', error2);
              throw error2;
            }
            successResponse(context, userResult);
          });
        });
      } catch (err) {
        errorResponse(context, err);
      }
    } else {
      runFinalQuery(context, userQuery);
    }
  }
}

// foreign keys may prevent deletion
function handleUsersDELETE (httpEvent, context) {
  const params =  httpEvent.queryStringParameters;
  console.log('deleting user', params.id);
  let userQuery = 'DELETE FROM user WHERE user_id = ?';
  const inserts = [params.id];
  userQuery = mysql.format(userQuery, inserts);
  if (params.type === 'user') {
    runFinalQuery(context, userQuery);
  } else if (params.type === 'vendor') {
    try {
      let vendorUpdate = 'DELETE FROM vendor WHERE user_id = ?';
      vendorUpdate = mysql.format(vendorUpdate, inserts);
      console.log('running vendor query:', vendorUpdate);
      console.log('running user query:', userQuery);
      pool.query(vendorUpdate, (error, results) => {
        if (error) {
          console.log('found err in q: ', error);
          throw error;
        }
        pool.query(userQuery, (error2, results2) => {
          if (error2) {
            console.log('found err in q: ', error2);
            throw error2;
          }
          successResponse(context, results2);
        });
      });
    } catch (err) {
      errorResponse(context, err);
    }
  }
}

function getTaskType (path) {
  const matches = path.match(/users\/(\w*)\/?/);
  if(matches) {
    return matches[1];
  } else {
    return null;
  }
}