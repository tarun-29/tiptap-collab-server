// import debounce from 'debounce'
// import {Server} from '@hocuspocus/server'
// import {TiptapTransformer} from '@hocuspocus/transformer'
// import axios from "axios"

// let debounced

// const server = Server.configure({
//   port: 1234,
//   timeout: 30000,
//   debounce: 2000,
//   maxDebounce: 30000,

//   async onAuthenticate(data) {
//     const { token } = data
//     console.log("Checking here inside authentication", token )
//     const {user_id} = jwt.decode(token)
//     return new Promise(function(resolve, reject) {
//       db.query(`SELECT * from employees where user_id=${user_id}`, function (error, results, fields) {
//         if (error){
//           data.connection.readOnly = true
//           return reject(err);
//         } 
//         else { resolve({results, token});}
//       });
//     });
//   },

//   async onChange(data) {
//     const save = ()=>{
//       const {documentName} = data
//       const {token: authToken} = data?.context
//       console.log("cheking here")
//       const {account_id: accountId} = data?.context?.results[0]
//       const [bizReviewId, bizScheduleId, cardId, noteId] = documentName?.split("-").splice(1,4)
//       const URL = `/accounts/${accountId}/biz_reviews/${bizReviewId}/biz_review_schedules/${bizScheduleId}/biz_review_cards/${cardId}/biz_review_notes/${noteId}`;
//       const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document)
//       // const prosemirrorHTML = generateHTML(prosemirrorJSON?.default, extensionsArray)
//       const documentState = Y.encodeStateAsUpdate(data.document)
//       const base64Encoded = js64.fromUint8Array(documentState)
//       const biz_review_note = {
//         note_text: {noteData: prosemirrorJSON?.default} ,
//         // note_html: prosemirrorHTML,
//         note_ydoc: base64Encoded
//       }
//       axios.put(`http://localhost:3000${URL}`, biz_review_note, {
//           headers: {
//             Authorization: `Bearer ${authToken}`
//           }
//         }).then((res)=>{
//           console.log("Checking here response", res?.data)
//         }).catch((err)=>{
//           console.log("Checking errro here",err)
//         })
//       }
//       debounced?.clear()
//       debounced = debounce(save, 2000)
//       debounced()
//   },
// })

// server.listen()



// import debounce from 'debounce'
import {Server} from '@hocuspocus/server'
// import {TiptapTransformer} from '@hocuspocus/transformer'
// import axios from "axios"

let debounced

const server = Server.configure({
  port: 1234,
})

server.listen()

