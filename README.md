# community-discussion-forum
#comdisfo
This project is for setting up a front-end and back-end for a generic community discussion forum. 

## Installation

### a. server-node


### b. ui-react

In the comdisfo-ui-react directory, use the command line to type the following:

```bash
# Install dependencies
npm install

# Run the node.js server
npm start

```

In a web browser, go to the url [http://localhost:8080/](http://localhost:8080/).

## Configuration

### a. server-node


### b. ui-react

Configuration options are set in the file [config.js]

| Option       | Description                             |
|--------------|-----------------------------------------|
| apiPath   | Path for REST API (i.e.: "/api/v1/comdisfo/").|


## Requesting Information

GET /userinfo </br>
GET /topics </br>
GET /topicinfo </br>

## Ordering
GET /topics?order=update_dt.asc

## Filtering
GET /userinfo?user_id=1234 </br>
GET /topicinfo?topic_id=9876 </br>

## Database (name: comdisfo)

### Tables 
| Table Name   | Meaning                                 |
|--------------|-----------------------------------------|
| USER         | This will be used to store user info |    
| TOPICS       | This will be used to store all topics of a forum |  
| TOPIC        | This will be used to store all information about the topic |  

#### Table - USER
| Field Name  | Type, Meaning                                 |
|--------------|-----------------------------------------|
| uuid         			| string, unique id of user |    
| name         			| string, name of user | 
| email        			| string, email of user, userid of user |
| create_dt    			| date, create date of user info |  
| last_update_dt 		| date, last update date of user info | 
| subscribed_topics 	| string, of topic uuid separated by char  | 

#### Table - TOPICS
| Field Name  | Type, Meaning                                 |
|--------------|-----------------------------------------|
| uuid         		| string, unique id of topic |    
| name         		| string, name of topic | 
| tag        		| string, of tags separated by char | 
| upvote_cnt        | integer, upvote count if user vote it |
| view_cnt          | integer, views count of topic |
| comments_cnt 		| integer, count of comments on topic |

#### Table - TOPIC
| Field Name  | Type, Meaning                                 |
|--------------|-----------------------------------------|
| uuid         		| string, unique id of topic |    
| name         		| string, name of topic | 
| tag        		| string, of tags separated by char |
| comments        	| string, of comments separated by a char |
| created_by        | string, user uuid |
| create_dt    		| date, create date |  
| last_update_dt    | date, last update date  | 
| comments_cnt 	| integer, count of comments on topic |

