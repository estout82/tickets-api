
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport')
const AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2');
const { param } = require('../controllers/user');

let router = express.Router();

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new AzureAdOAuth2Strategy({
    clientID: '66aca68b-31c6-4017-85b0-74c243e4ae90',
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    callbackURL: 'http://localhost:9000/auth/azureadoauth2/callback',
    tenant: 'ericstoutenburg7gmail.onmicrosoft.com'
  },
  function (accessToken, refresh_token, params, profile, done) {
    var userInfo = jwt.decode(params.id_token, '', true);

    // do some stuff
    let user = userInfo.upn;
    done(null, user);
}));
  
router.get('/auth/azureadoauth2',
    passport.authenticate('azure_ad_oauth2'));

router.get('/auth/azureadoauth2/callback', 
    passport.authenticate('azure_ad_oauth2', { failureRedirect: '/return' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/return');
});

router.get('/return', (req, res, next) => {
    console.dir(req);
    res.json({ msg: 'hi' });
});

module.exports = router;
