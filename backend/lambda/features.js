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
            q = 'SELECT * FROM interested WHERE feature_id = ?';
            inserts = [params.id];
            q = mysql.format(q, inserts);
            runFinalQuery(context, q);
        }
    }else if(task === "details") {
        if(params.task === "feature") {
            if(params.type === 0) {
                q = 'SELECT f.*, food.* FROM feature f, food WHERE f.feature_id = food.feature_id AND f.feature_id = ?';
                inserts.append(params.id);
            } else if(params.type === 1) {
                q = 'SELECT f.*, m.* FROM feature f, music m WHERE f.feature_id = music.feature_id AND f.feature_id = ?';
                inserts.append(params.id);
            } else if(params.type === 2) {
                q = 'SELECT f.*, v.* FROM feature f, venue v WHERE f.feature_id = v.feature_id and f.feature_id = ?';
                inserts.append(params.id);
            } else if(params.type === 3) {
                q = 'SELECT f.*, c.* FROM feature f, clothing c WHERE f.feature_id = c.feature_id and f.feature_id = ?';
                inserts.append(params.id);
            }
            q = mysql.format(q, inserts);
            runFinalQuery(context, q);
        } else if(params.task === "vendorBid"){
            q = 'SELECT * FROM user u, vendor v, interested i WHERE u.user_id = v.user_id AND v.vendor_id = i.vendor_id AND i.feature_id = ?'
            inserts.append(params.id);
            q = mysql.format(q, inserts);
            runFinalQuery(context, q);
        } else if(params.task === "recommendation") {
            q = 'SELECT * FROM user u, vendor v, interested i WHERE u.user_id = v.user_id AND v.vendor_id = i.vendor_id AND  i.feature_id = ? AND i.vendor_id = (SELECT vendor_id FROM recommend WHERE feature_id = ?)';
            inserts.append(params.id);
            inserts.append(params.id);
            q = mysql.format(q, inserts);
            runFinalQuery(context, q);
        }
    }
}

function handleFeaturesPOST (httpEvent, context) {
    const task = httpEvent.queryStringParameters.task;
    if(task == "feature") {
        let feature = JSON.parse(httpEvent.body);
        const type = feature.feature_type;
        let featureQuery = 'INSERT INTO feature SET event_id = ?, status = ?, additional_requests = ?, feature_type = ?';
        const inserts = [feature.eventId, feature.status, feature.additional_requests, feature.feature_type];
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
                if(type === 0) {
                    typeQuery = 'INSERT INTO food SET feature_id = ?, category = ?, wait_staff = ?';
                    typeInserts = [results.feature_id, feature.category, feature.wait_staff];
                } else if(type === 1) {
                    typeQuery = 'INSERT INTO music SET feature_id = ?, genre = ?, live_music = ?';
                    typeInserts = [results.feature_id, feature.genre, feature.live_music];
                } else if(type === 2) {
                    typeQuery = 'INSERT INTO venue SET feature_id = ?, num_of_people = ?, outdoors = ?, type_of_location = ?';
                    typeInserts = [results.feature_id, feature.num_of_people, feature.outdoors, feature.type_of_location];
                } else if(type === 3) {
                    typeQuery = 'INSERT INTO clothing SET feature_id = ?, color = ?, gender = ?';
                    typeInserts = [results.feature_id, feature.color, feature.gender];
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
        let q = 'INSERT INTO interested SET feature_id = ?, vendor_id = ?, bid = ?';
        const inserts = [bid.feature_id, bid.vendor_id, bid.bid];
        q = mysql.format(q, inserts);
        runFinalQuery(context, q);
    } else if(task === "recommendation") {
        let recommendation = JSON.parse(httpEvent.body);
        let q = 'INSERT INTO recommend SET feature_id = ?, vendor_id = ?, confirm = 0';
        const inserts = [recommendation.feature_id, recommendation.vendor_id];
        q = mysql.format(q, inserts);
        runFinalQuery(context, q);
    }

}


function handleFeaturesPUT (httpEvent, context) {
    const task = httpEvent.queryStringParameters.task;
    if(task === "feature") {
        let feature = JSON.parse(httpEvent.body);
        const type = feature.feature_type;
        const id = httpEvent.queryStringParameters.id;
        let featureQuery = 'UPDATE feature SET event_id = ?, status = ?, additional_requests = ?, feature_type = ? WHERE feature_id = ?';
        const inserts = [feature.eventId, feature.status, feature.additional_requests, feature.feature_type, id];
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
                if(type === 0) {
                    typeQuery = 'UPDATE food SET feature_id = ?, category = ?, wait_staff = ?';
                    typeInserts = [feature.feature_id, feature.category, feature.wait_staff];
                } else if(type === 1) {
                    typeQuery = 'UPDATE music SET feature_id = ?, genre = ?, live_music = ?';
                    typeInserts = [feature.feature_id, feature.genre, feature.live_music];
                } else if(type === 2) {
                    typeQuery = 'UPDATE venue SET feature_id = ?, num_of_people = ?, outdoors = ?, type_of_location = ?';
                    typeInserts = [feature.feature_id, feature.num_of_people, feature.outdoors, feature.type_of_location];
                } else if(type === 3) {
                    typeQuery = 'UPDATE clothing SET feature_id = ?, color = ?, gender = ?';
                    typeInserts = [feature.feature_id, feature.color, feature.gender];
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
        let id = httpEvent.body;
        let q = 'UPDATE recommend SET confirm = 1 WHERE feature_id = ?';
        let inserts = [id];
        q = mysql.format(q, inserts);
        runFinalQuery(context, q);
    } else if(task === "reject") {
        let id = httpEvent.body;
        let q = 'DELETE FROM recommend WHERE feature_id = ?';
        let inserts = [id];
        q = mysql.format(q, inserts);
        runFinalQuery(context, q);
    }

}


function handleFeaturesDELETE (httpEvent, context) {
    const id = httpEvent.queryStringParameters.id;
    let q = 'DELETE FROM feature WHERE feature_id = ?'
    const inserts = [id];
    q = mysql.format(q, inserts);
    runFinalQuery(context, q);
}

function getTaskType (path) {
    const matches = path.match(/features\/(\w*)\/?/);
    if(matches) {
        return matches[1];
    } else {
        return null;
    }
}