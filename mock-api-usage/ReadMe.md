# Mock API Usage Guide

## API Endpoint
https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/:endpoint

note: you need to replace endpoint with correct resource name.

As for Homework 2, here is the list of APIs we will use:
* **POST** Login: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/login
* **POST** Register: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/register
* **GET** Activity Feed: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/activity_feed/:id **(Replace ":id" with the id number you want)**
* **GET** User Following: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/follow_user/:id
* **POST** User Following: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/follow_user
* **DELETE** User Following: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/follow_user/:id
* **POST** Comments: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/comments
* **GET** Comments: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/comments/:id
* **DELETE** Commnets: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/comments/:id
* **POST** Post: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/post
* **PUT** Post: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/post/:id
* **POST** Like_post: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/like_post
* **DELETE** Post: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/post/:id
* **GET** Search: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/search
* **GET** Profile: https://634a0b3a33bb42dca4fd758e.mockapi.io/5570/Group9/profile/:id

### Clone Mock API Project
Follow this link: https://mockapi.io/clone/633b9c06f11701a65f65a7e3

### Some Tips:
* For the **POST** request, Mock API does not support passing "id" as a field to the path of URL.
* As for the first row of the response body, Mock API set the returned data type to be Object ID. Even though we design all types of IDs as UUID type in SwaggerHub, we cannot pass a UUID type of ID to the URL, which will cause the error "Something went wrong while parsing response JSON". 
* So in this homework, we need to use Object ID type as the type of the id, which is a binary representation of JSON. But in later part of the project, we can pass UUID type of id to the backend. 
