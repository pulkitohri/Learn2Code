export const OktaConfig = {
    clientId:"0oaeumsec7ufeZGzu5d7",
    issuer: "https://dev-55885436.okta.com/oauth2/default",
    redirectUri:"http://localhost:3000/login/callback",
    scopes:["openid" , "profile" , "email"],
    pkce:true,
    disableHttpCheck:true,
}