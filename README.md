The repository below contains various components
1.controllers
a.lipacallback.js = this is where the callback received from the stk comes
b.lipanampesa.js = is where verification and authentication occurs

2.middlewares
a.authorization.js = it's where the access token is gotten from
b.ngrokURL = it is where an ngrok port is gotten

3.models
a.Transaction.js = it's where the mongoose schema is

4.Services
a.avax.js = mainly gets the avax price
b.mpesa.js = contains details required for the stk push

5.views
a.payment.ejs = using the ejs view enginee the front end is viewed from here

6.env file
I haven't addded it to the repository since it contains sensitive info e.g authtokens, consumer keys and consumer secrets e.t.c


NB: the webapp is still in it's final stage and i'm currently debugging the errors so that it may run smoothly

by Glourvell
