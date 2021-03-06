//////// FEATURES

function handleFeaturesGET (httpEvent, context) {
  const task = getTaskType(httpEvent.path);
  const params = httpEvent.queryStringParameters;
  let q;
  let inserts = [];
  console.log('task: ', task);
  if(task === "all") {
    if(params.task === "event") {
      q = 'SELECT * FROM feature WHERE event_id = ?'
      inserts = [params.id];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    }else if(params.task === "bid") {
      q = 'SELECT v.*, i.* FROM vendor v, interested i WHERE i.vendor_id = v.vendor_id and i.feature_id = ?';
      inserts = [params.id];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    }
  }else if(task === "details") {
    if(params.task === "feature") {
      if(params.type == 0) {
        q = 'SELECT f.*, food.* FROM feature f, food WHERE f.feature_id = food.feature_id AND f.feature_id = ?';
      } else if(params.type == 2) {
        q = 'SELECT f.*, m.* FROM feature f, music m WHERE f.feature_id = m.feature_id AND f.feature_id = ?';
      } else if(params.type == 1) {
        q = 'SELECT f.*, v.* FROM feature f, venue v WHERE f.feature_id = v.feature_id and f.feature_id = ?';
      } else if(params.type == 3) {
        q = 'SELECT f.*, c.* FROM feature f, clothing c WHERE f.feature_id = c.feature_id and f.feature_id = ?';
      }
      inserts = [params.id];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    } else if(params.task === "vendorBid"){
      q = 'SELECT * FROM user u, vendor v, interested i WHERE u.user_id = v.user_id AND v.vendor_id = i.vendor_id AND i.feature_id = ? AND i.vendor_id = ?';
      inserts = [params.featureId, params.vendorId];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    } else if(params.task === "recommendation") {
      q = 'SELECT * FROM user u, vendor v, interested i WHERE u.user_id = v.user_id AND v.vendor_id = i.vendor_id AND  i.feature_id = ? AND i.vendor_id = (SELECT vendor_id FROM recommend WHERE feature_id = ?)';
      inserts = [params.id, params.id];
      q = mysql.format(q, inserts);
      runFinalQuery(context, q);
    }
  } else if (task === 'recs') {
    q = 'SELECT * FROM recommend WHERE feature_id in (' + params.featureIds + ')';
    console.log('recommend query', q);
    runFinalQuery(context, q);
  }
}

function handleFeaturesPOST (httpEvent, context) {
  const task = httpEvent.queryStringParameters.task;
  if(task === "feature") {
    let feature = JSON.parse(httpEvent.body);
    const type = feature.feature_type;
    let featureQuery = 'INSERT INTO feature SET event_id = ?, status = ?, additional_requests = ?, feature_type = ?';
    const inserts = [feature.event_id, feature.status, feature.additional_requests, feature.feature_type];
    featureQuery = mysql.format(featureQuery, inserts);
    try {
      console.log('running feature query', featureQuery);
      pool.query(featureQuery, feature, (error, results) => {
        if (error) {
          console.log('found err in q: ', error);
          throw error;
        }

        let featureResult = getResult(results);
        let typeQuery;
        let typeInserts;
        if(type == 0) {
          typeQuery = 'INSERT INTO food SET feature_id = ?, category = ?, wait_staff = ?';
          typeInserts = [results.insertId, feature.category, feature.wait_staff];
        } else if(type == 2) {
          typeQuery = 'INSERT INTO music SET feature_id = ?, genre = ?, live_music = ?';
          typeInserts = [results.insertId, feature.genre, feature.live_music];
        } else if(type == 1) {
          typeQuery = 'INSERT INTO venue SET feature_id = ?, num_of_people = ?, type_of_location = ?';
          typeInserts = [results.insertId, feature.num_of_people, feature.type_of_location];
        } else if(type == 3) {
          typeQuery = 'INSERT INTO clothing SET feature_id = ?, color = ?, gender = ?';
          typeInserts = [results.insertId, feature.color, feature.gender];
        }

        typeQuery = mysql.format(typeQuery, typeInserts);
        console.log('running vendor query:', typeQuery);
        pool.query(typeQuery, feature, (error2, results2) => {
          if (error2) {
            console.log('found err in q: ', error2);
            throw error2;
          }
          successResponse(context, featureResult);
        });
      });
    } catch (err) {
      errorResponse(context, err);
    }
  } else if(task === "bid") {
    let bid = JSON.parse(httpEvent.body);
    let q = 'INSERT INTO interested SET feature_id = ?, vendor_id = ?, bid = ?, amount = ?';
    const inserts = [bid.feature_id, bid.vendor_id, bid.bid, bid.amount];
    q = mysql.format(q, inserts);
    runFinalQuery(context, q);
  } else if(task === "recommendation") {
    let recommendation = JSON.parse(httpEvent.body);
    let q = 'INSERT INTO recommend SET feature_id = ?, vendor_id = ?, confirm = 0, amount = ?';
    const inserts = [recommendation.feature_id, recommendation.vendor_id, recommendation.amount];
    q = mysql.format(q, inserts);
    runFinalQuery(context, q);
  }

}


function handleFeaturesPUT (httpEvent, context) {
  const task = httpEvent.queryStringParameters.task;
  console.log("TASK:", task);
  if(task === "feature") {
    let feature = JSON.parse(httpEvent.body);
    const type = feature.feature_type;
    const id = httpEvent.queryStringParameters.id;
    let featureQuery = 'UPDATE feature SET event_id = ?, status = ?, additional_requests = ?, feature_type = ? WHERE feature_id = ?';
    const inserts = [feature.event_id, feature.status, feature.additional_requests, feature.feature_type, id];
    featureQuery = mysql.format(featureQuery, inserts);
    try {
      console.log('running feature query', featureQuery);
      pool.query(featureQuery, feature, (error, results) => {
        if (error) {
          console.log('found err in q: ', error);
          throw error;
        }

        let featureResult = getResult(results);
        let typeQuery;
        let typeInserts;
        if(type == 0) {
          typeQuery = 'UPDATE food SET feature_id = ?, category = ?, wait_staff = ?';
          typeInserts = [feature.insertId, feature.category, feature.wait_staff];
        } else if(type == 2) {
          typeQuery = 'UPDATE music SET feature_id = ?, genre = ?, live_music = ?';
          typeInserts = [feature.insertId, feature.genre, feature.live_music];
        } else if(type == 1) {
          typeQuery = 'UPDATE venue SET feature_id = ?, num_of_people = ?, type_of_location = ?';
          typeInserts = [feature.insertId, feature.num_of_people, feature.type_of_location];
        } else if(type == 3) {
          typeQuery = 'UPDATE clothing SET feature_id = ?, color = ?, gender = ?';
          typeInserts = [feature.insertId, feature.color, feature.gender];
        }

        typeQuery = mysql.format(typeQuery, typeInserts);
        console.log('running vendor query:', typeQuery);
        pool.query(typeQuery, feature, (error2, results2) => {
          if (error2) {
            console.log('found err in q: ', error2);
            throw error2;
          }
          successResponse(context, featureResult);
        });
      });
    } catch (err) {
      errorResponse(context, err);
    }
  } else if(task === "confirm") {
    let id = httpEvent.queryStringParameters.featureId;
    let q = 'UPDATE recommend SET confirm = 1 WHERE feature_id = ?';
    let inserts = [id];
    q = mysql.format(q, inserts);

    try {
      console.log('running recommend query:', q);
      pool.query(q, (error, results) => {
        if (error) {
          console.log('found err in q: ', error);
          throw error;
        }

        let featureQ = 'UPDATE feature SET status = 1 WHERE feature_id = ?';
        featureQ = mysql.format(featureQ, inserts);
        console.log('running feature query:', featureQ);
        pool.query(featureQ, (error2, results2) => {
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
  } else if(task === "reject") {
    let id = httpEvent.queryStringParameters.featureId;
    let q = 'DELETE FROM recommend WHERE feature_id = ?';
    let inserts = [id];
    q = mysql.format(q, inserts);
    runFinalQuery(context, q);
  }

}


function handleFeaturesDELETE (httpEvent, context) {
  const params = httpEvent.queryStringParameters;
  try {
    let table;
    switch(params.type) {
      case "0":
        table = 'food';
        break;
      case "1":
        table = 'venue';
        break;
      case "2":
        table = 'music';
        break;
      case "3":
        table = 'clothing';
        break;
    }
    let q = `DELETE FROM ${table} WHERE feature_id = ?`;
    const inserts = [params.id];
    q = mysql.format(q, inserts);
    console.log('deleting feature type:', q);
    pool.query(q, (error, results) => {
      if (error) {
        console.log('found err in q: ', error);
        throw error;
      }
      let fq = 'DELETE FROM feature WHERE feature_id = ?'
      fq = mysql.format(fq, inserts);
      pool.query(fq, (error2, results2) => {
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

function getTaskType (path) {
  const matches = path.match(/features\/(\w*)\/?/);
  if(matches) {
    return matches[1];
  } else {
    return null;
  }
}