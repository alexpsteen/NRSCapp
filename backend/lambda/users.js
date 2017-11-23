//////// USERS

function handleUsersGET (httpEvent, context) {
  const cognitoId = httpEvent.requestContext.identity.cognitoIdentityId;
  let q = 'SELECT * FROM user WHERE authentication_id = ?';
  const inserts = [cognitoId];
  q = mysql.format(q, inserts);
  runFinalQuery(context, q);
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
  const cognitoId = httpEvent.requestContext.identity.cognitoIdentityId;
  const userObj = JSON.parse(httpEvent.body);
  const user = userObj.user;
  const vendor = userObj.vendor;
  let userQuery = 'UPDATE user SET first_name = ?, last_name = ?, cellphone_number = ? WHERE authentication_id = ?';
  const inserts = [user.first_name, user.last_name, user.cellphone_number, cognitoId];
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
        let vendorUpdate = 'UPDATE vendor SET address = ?, description = ?, name = ?'
        const vendorInserts = [vendor.address, vendor.description, vendor.name];
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

function handleUsersDELETE (httpEvent, context) {
  console.log('Users DELETE not implemented');
  successResponse(context, {});
}