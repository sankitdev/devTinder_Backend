## authRouter

- post /signup
- post /login
- post /logout

## profileRouter

- get /profile/view
- patch /profile/updateInfo (this will not allow email and Name, and password)
- patch /profile/password

# connectionRequestRouter

- post /request/send/:status/:userId
- status can be interested or ignored
- post /request/review/:status/:requestId
- status can be [accepted, rejected]

Status: ignore, interested, accepted, rejected

## userRouter

- get /user/request
- In this If I open my profile I should see the details of people whole have sent me requests etc....
- get /user/connections
- In this I will get the people who have I acceped and are connected with
- get /user/feed - gets the profiles
- In this I will get the feed of all the profile available. If I accept or reject that should not be shown to me any more
