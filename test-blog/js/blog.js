import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase,get,ref } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnfFTNTUzKPY0-BUsSr4qB5gxJ_cDQ6EY",
    authDomain: "blogtest-5ed7c.firebaseapp.com",
    projectId: "blogtest-5ed7c",
    storageBucket: "blogtest-5ed7c.firebasestorage.app",
    messagingSenderId: "172685472662",
    appId: "1:172685472662:web:dfb7e7e4435bb476d0a3b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getDatabase(app)




function getPostData (){
    const user_ref = ref(db,'post/');
    get(user_ref).then((snapshot)=>{
        const data = snapshot.val()
       
       let html = "";
       const table = document.querySelector('.main')
        for (const key in data){
          const{title,post_content,post_image,post_link} = data[key]
  
          let imageHtml = post_image ? `<img src="${post_image}" alt="image" style="max-width:100%;margin:10px 0;">` : '';
          let linkHtml = post_link ? `<a href="${post_link}" target="_blank" class="post-link">Перейти по ссылке</a>` : '';
         
           html+= `
           <div class="post"> 
               <h2>${title}</h2>
               ${imageHtml}
               <p>
                 ${post_content}
               </p>
               ${linkHtml}
           </div>
          `
  
        }
  table.innerHTML =html
  
    })
  }
  
  getPostData()
  