# community-discussion-forum
#comdisfo
This project is setting up a front-end and back-end for a generic community discussion forum. 

## Configuration


### Requesting Information

|GET /userinfo|
|GET /topics|
|GET /topicinfo|

#### Ordering
|GET /topics?order=update_dt.asc|

#### Filtering
|GET /userinfo?user_id=1234|
|GET /topicinfo?topic_id=9876|


### Database (Name: Forums)
### Tables 

| Table Name   | Meaning                                 |
|--------------|-----------------------------------------|
| USER         | This will be used to store user info |    
| TOPICS       | This will be used to store all topics of a forum |  
| TOPIC        | This will be used to store all information about the topic |  
