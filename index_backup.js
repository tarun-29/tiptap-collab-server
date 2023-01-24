// import { Server } from '@hocuspocus/server'
// import {TiptapTransformer} from '@hocuspocus/transformer'

// const server = Server.configure({
//   port: 1234,
//   timeout: 30000,
//   debounce: 2000,
//   maxDebounce: 20000,
//   // quiet: true,
//   async onChange(data) {
//     const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document)
//     console.log("Checking here +++++++++++++++++++", prosemirrorJSON, "\n\n\n\n")
//     console.log("Checking here &&&---------------------------", data?.documentName, data?.clientsCount, "\n\n\n\n")
//   }
// })

// server.listen()


import debounce from 'debounce'
import {Server} from '@hocuspocus/server'
import {TiptapTransformer} from '@hocuspocus/transformer'
import axios from "axios"
// import Document from '@tiptap/extension-document'
// import Paragraph from '@tiptap/extension-paragraph'
// import Text from '@tiptap/extension-text'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { generateHTML } from '@tiptap/html'

// let debounced

// const server = Server.configure({
//   port: 1234,
//   timeout: 30000,
//   debounce: 2000,
//   maxDebounce: 20000,
//   async onAuthenticate({ documentName, token }) {
//     console.log("We are here verifying stuff", documentName, token)
//     // Could be an API call, DB query or whatever …
//     // The endpoint should return 200 OK in case the user is authenticated, and an http error
//     // in case the user is not.
//     return axios.get('/user', {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//   },
//   async onChange(data) {
//   console.log("Checking here",server.getConnectionsCount(), server.getDocumentsCount())
//     const save = () => {
//       // Convert the y-doc to something you can actually use in your views.
//       // In this example we use the TiptapTransformer to get JSON from the given
//       // ydoc.
//       const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document)
//       console.log("Checking here +++++++++++++++++++", prosemirrorJSON, "\n")
//       // Save your document. In a real-world app this could be a database query
//       // a webhook or something else
//       // writeFile(
//       //   `/path/to/your/documents/${data.documentName}.json`,
//       //   prosemirrorJSON
//       // )

//       // Maybe you want to store the user who changed the document?
//       // Guess what, you have access to your custom context from the
//       // onAuthenticate hook here. See authorization & authentication for more
//       // details
//       // console.log(`Document ${data.documentName} changed by ${data.context.user.name}`)
//     }

//     debounced?.clear()
//     debounced = debounce(save, 4000)
//     debounced()
//   },
// })

// server.listen()



// Specific to our tiptap collaboration hocuspocus server
// const Server = require('@hocuspocus/server').Server
// const TiptapTransformer = require('@hocuspocus/transformer').TiptapTransformer
// const debounce = require('debounce').debounce
// const Document = require('@tiptap/extension-document')
// const Paragraph = require('@tiptap/extension-paragraph')
// const Text = require('@tiptap/extension-text')


let debounced

const json = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Example ',
        },
        {
          type: 'text',
          text: 'Text',
        },
      ],
    },
  ],
}

const accountId = 17

const server = Server.configure({
  port: 1234,
  timeout: 30000,
  debounce: 2000,
  maxDebounce: 30000,

  async onAuthenticate(data) {
    const { token } = data
    console.log("Checking here", data)
    // Hit BE and verify user
    return {token}
    // return axios.get(`http://localhost:3000/users/get_user_details.json`, {
    // // return axios.get(`http://${process.env.API_DOMAIN}/users/get_user_details.json`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // })
  },

  async onLoadDocument(data){
    const fieldName = 'default'
    const {documentName, employeeId, employeeName} = data
    const [bizReviewId, bizScheduleId, cardId, noteId] = documentName?.split("-").splice(1,4)
    // const {dashboard_auth_token : authToken, account_id: accountId, } = data?.context?.data
    const {token: authToken} = data?.context
    // console.log("Checking here", authToken, bizReviewId, bizScheduleId, cardId, noteId)
    const URL = `/accounts/${accountId}/biz_reviews/${bizReviewId}/biz_review_schedules/${bizScheduleId}/biz_review_cards/${cardId}`;
    const documentData = await axios.get(`http://localhost:3000${URL}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
    if (!data.document.isEmpty(fieldName)) {
      return
    }
    if(documentData?.data?.note_text?.noteData){
      const prosemirrorJSON = documentData?.data?.note_text?.noteData
      console.log("Checking here inside if loop", prosemirrorJSON, json, Document,Paragraph, Text) 
      const newDoc = TiptapTransformer.toYdoc(prosemirrorJSON, fieldName, [ Document, Paragraph, Text ])
      data.document.merge(newDoc)
    }
  },

  async onChange(data) {
    const save = ()=>{
    const {documentName} = data
    // const {dashboard_auth_token : authToken, account_id: accountId, } = data?.context?.data
    const {token: authToken} = data?.context
    const [bizReviewId, bizScheduleId, cardId, noteId] = documentName?.split("-").splice(1,4)
    console.log("\n\n\n Checking here the data context and values\n",  documentName, bizReviewId, bizScheduleId, cardId, noteId, "\n\n\n");
    // Data extracted out from editor instance in JSON form to pass it to database
    const URL = `/accounts/${accountId}/biz_reviews/${bizReviewId}/biz_review_schedules/${bizScheduleId}/biz_review_cards/${cardId}/biz_review_notes/${noteId}`;
    const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document)
    const prosemirrorHTML = generateHTML(prosemirrorJSON?.default, [Document, Paragraph, Text])
    const biz_review_note = {
      note_text: {noteData: prosemirrorJSON?.default} ,
      note_html: prosemirrorHTML,
    }
    axios.put(`http://localhost:3000${URL}`, biz_review_note, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((res)=>{
    console.log("Checking here response", res?.data)
      }).catch((err)=>{
        console.log("Checking errro here",err)
      })
    }
    debounced?.clear()
    debounced = debounce(save, 2000)
    debounced()
  },
})

server.listen()