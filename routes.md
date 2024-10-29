## authRouter

- post /signup
- post /login
- post /logout

## profileRouter

- get /profile/view
- patch /profile/updateInfo (this will not allow email and Name, and password)
- patch /profile/password

# connectionRequestRouter

- post /request/send/interested/:userId
- post /request/send/ignored/:userId
- post /request/review/accepted/:requestId
- post /request/review/rejected/:requestId

Status: ignore, interested, accepted, rejected

## userRouter

- get /user/connections
- get /user/request
- get /user/feed - gets the profiles
