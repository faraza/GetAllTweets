/* faraza
 *Give me a handle, and I will give you an array of all accessible tweets
 *
 */

var TwitModule = require ("Twit");



/* Fill in these values with ones given by Twitter API
 * (Create a Twitter app, and they will provide you with these)
 */
var config1 = {
    consumer_key: 'XXXX'
  , consumer_secret: 'XXXX'
  , access_token: 'XXXX'
  , access_token_secret: 'XXXX'
}


var twit = new TwitModule(config1);
//var tweetsArray;
var maxCalls = 0;
var theLastTweet;


function getParam(lastTweet, idNum){
    var params;
    this.theLastTweet = lastTweet;
    if (lastTweet){
        params = {
            user_id: idNum//idsArr[playerNumber]
            ,count: 200
            ,max_id: lastTweet.id
        };
    }
    else{
        params = {
            user_id: idNum//idsArr[playerNumber]
            ,count: 200
        };
    }
    
    return params;
}

/*Given Twitter ID number and callback, feeds callback the array of tweets
 *
 */

function getAllTweets(idNum, callback, lastTweet, tweetsArray) {
    if (!lastTweet) {
        this.theLastTweet = null;
    }

    var params = getParam(lastTweet, idNum)
    maxCalls++;
    if (maxCalls<300) {
            
        
        //can do 300 / 15mins with app authentication according to API
        twit.get('statuses/user_timeline', params, function(err, reply){
            //console.log("reply length: " + reply.length);
            if (err) {
                tweetsArray = "stop";
                console.log(err);
            }
            populateTweetsArray(reply,idNum, callback, tweetsArray);
        });
    }
    else{
        console.log("over the limit");
    }
}

function areAllTweetsRetrieved(replyArray) {
    if (replyArray) {
        if (replyArray.length>0) {
            if (this.theLastTweet) {            
                if (replyArray[0].id == this.theLastTweet.id && replyArray.length==1) {
                    return true;
                }
                else{
                    return false;
                }
            }
            else{ //if you overcall the API, you may run into this issue
                return true;
            }
        }
        else{
            //also add error checking (i.e. reply is empty because you're blocked out of API)
            return true;
        }
    }
    else{
        console.log("POSSIBLE ERROR: ARRAY PASSED TO areAllTweetsRetrieved() IS NULL");
    }
}


function printTweets(array) {
    console.log(array.length);
    //console.log(array[array.length-1].text)
    for (var i = 0; i <array.length; i++){
        if (array[i].retweeted_status) {
            console.log(array[i].retweeted_status.text);
        }
        else{
            console.log(array[i].text);
        }
        
        //console.log(array[i].id +"\n\n");
    }
    
}

function populateTweetsArray(reply, idNum, callback, tweetsArray){
    if (tweetsArray) {
        if (tweetsArray == "stop") {
            callback(["Users tweets are not public"]);
        }
        else if (areAllTweetsRetrieved(reply)) { //tweetsArray has all of idArray
            //console.log("done!"); //if we reach this if, we're done.
            if (callback) {
                callback(tweetsArray);
                //return tweetsArray;
            }
        }
        else{
            for (var i = 0; i<reply.length; i++) {
                tweetsArray.push(reply[i]);
            }
            
            getAllTweets(idNum, callback, reply[reply.length-1], tweetsArray);
        }
    }
    else{
        tweetsArray = reply;
        getAllTweets(idNum, callback, reply[reply.length-1], tweetsArray);
    }
}

/*Given Twitter handle, runs callback passing handle's corresponding Idnum as callback
 *
 */
function getId(handle, callback){
    var params = {
        screen_name: handle//idsArr[playerNumber]
        };
    
    twit.get('users/show', params, function(err, reply){
        if (err) {
            if (err.code == 34) {
                callback("error");
                console.log("no users found with that handle");
            }       
        }
        else{
            callback(reply.id);
        }
    });    
}

function getTweets(handle, callback){
    getId(handle, function (id){
        getAllTweets(id, callback);    
    });
}

exports.getId = getId;
exports.getTweets = getTweets;
exports.getAllTweets = getAllTweets; //most users will not want to use getAllTweets; getAllTweets is the same as getTweets, but it takes the Twitter ID# instead of handle