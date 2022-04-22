var QRCode = require('qrcode')
var canvas = document.getElementById('canvas')
var uuid = require('uuid')
import {
  ApolloClient,
  InMemoryCache,
  useMutation,
  gql
} from "@apollo/client";
var valid = false
const current_uuid = uuid.v4()
const qrtext = `
{
  'type': 'CHROME_EXTENSION_LOGIN_REQUEST',
  'key': ${current_uuid}
}
`

const client = new ApolloClient({
  uri: "https://whipped-api.phloxcorp.io:446/",
  cache: new InMemoryCache(),
});


QRCode.toCanvas(canvas, qrtext, function (error) {
  if (error) console.error(error)
  console.log('success!');
})


function checkValid(){
  chrome.storage.local.get('token', (result)=>{
    if (result.token){
      clearInterval(timer);
    }else{
  client
  .mutate({
    mutation: gql`
    mutation{
      authenticateQRCode(input:{qrCodeType:CHROME_EXTENSION_LOGIN_REQUEST,key:"${current_uuid}"}) {
        token
      }
    }
    `,
    errorPolicy:"all"
  })
  .then(result => {chrome.storage.local.set({'token':result.authenticateQRCode.token}); }).catch(err=>{console.log(err)});
}
})}
  

const timer = setInterval(checkValid, 3000)  