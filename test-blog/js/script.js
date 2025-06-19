// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth,signInWithEmailAndPassword,onAuthStateChanged, signOut  } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase,set,ref,get,remove,update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
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

const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app)

const my_blog = document.querySelector('.my_blog')
const login_page = document.querySelector('.login')

onAuthStateChanged(auth,(user)=>{
   if(user){
      my_blog.classList.add('show')
      login_page.classList.add('hide')
   }else{
      my_blog.classList.remove('show')
      login_page.classList.remove('hide')
   }
})

function SignInUSer() {
 
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword (auth,email,password).then((userCredinals)=>{
       console.log(userCredinals.user.uid);
  })
}

const Sign_btn = document.querySelector('#sign_in')
Sign_btn.addEventListener('click',SignInUSer)

//   sign Out Logout 

const sign_out_btn = document.querySelector('#logout')
sign_out_btn.addEventListener('click',()=>{
   signOut(auth).then(()=>{
       //  
   }).catch((error)=>{
       console.log("error" + error);
   })
})

//  ------------
// Blog section code 

const notify = document.querySelector('.notifiy')

const add_post_Btn  = document.querySelector('#post_btn')

function Add_Post(){
     const title = document.querySelector('#title').value;
     const post_content = document.querySelector('#post_content').value;
     const post_link = document.querySelector('#post_link').value;
     const imageInput = document.querySelector('#post_image');
     const id = Math.floor(Math.random()*100)

     if (imageInput.files && imageInput.files[0]) {
        const imageFile = imageInput.files[0];
        const imageRef = sRef(storage, 'images/' + id + '_' + imageFile.name);
        uploadBytes(imageRef, imageFile).then((snapshot) => {
            getDownloadURL(imageRef).then((url) => {
                set(ref(db,'post/' + id),{
                    title:title,
                    post_content:post_content,
                    post_link:post_link,
                    post_image:url
                })
                notify.innerHTML = "data Added"
                document.querySelector('#title').value="";
                document.querySelector('#post_content').value="";
                document.querySelector('#post_link').value="";
                imageInput.value = "";
                GetPostData()
            });
        });
     } else {
        set(ref(db,'post/' + id),{
            title:title,
            post_content:post_content,
            post_link:post_link,
            post_image: ''
        })
        notify.innerHTML = "data Added"
        document.querySelector('#title').value="";
        document.querySelector('#post_content').value="";
        document.querySelector('#post_link').value="";
        imageInput.value = "";
        GetPostData()
     }
}

add_post_Btn.addEventListener('click',Add_Post)

// Get Data from firebase Db

function GetPostData(){
    const user_ref = ref(db,'post/')
     get(user_ref).then((snapshot)=>{
        const data = snapshot.val()
       
         let html = "";
         const table = document.querySelector('table')
         for( const key in data){
            const {title,post_content} = data[key]

              html+= `
               <tr>
                    <td> <span class="postNumber"></span></td>
                    <td>${title} </td>
                    <td> <button class="delete" onclick="delete_data(${key})">Delete</button> </td>
                    <td> <button class="update" onclick="update_data(${key})">Update</button> </td>
               </tr>
              `
         }

         table.innerHTML = html



     })
 }

GetPostData()

//  delete_data

window.delete_data = function(key){
   
    remove(ref(db,`post/${key}`))
    notify.innerHTML ="data Deleted"
    GetPostData()

}

// get and update data 

window.update_data = function (key) {
    const user_ref = ref(db,`post/${key}`)

     get(user_ref).then((item)=>{
        document.querySelector('#title').value = item.val().title;
        document.querySelector('#post_content').value = item.val().post_content;
       })


          const update_btn = document.querySelector('.update_btn')
           update_btn.classList.add('show')
            document.querySelector('.post_btn').classList.add('hide')
//   update

           function Update_Form (){
               const title = document.querySelector('#title').value;
               const post_content = document.querySelector('#post_content').value;
               const post_link = document.querySelector('#post_link').value;
               const imageInput = document.querySelector('#post_image');
               if (imageInput.files && imageInput.files[0]) {
                   const imageFile = imageInput.files[0];
                   const imageRef = sRef(storage, 'images/' + key + '_' + imageFile.name);
                   uploadBytes(imageRef, imageFile).then((snapshot) => {
                       getDownloadURL(imageRef).then((url) => {
                           update(ref(db ,`post/${key}`),{
                               title:title,
                               post_content:post_content,
                               post_link:post_link,
                               post_image:url
                           })
                           GetPostData()
                       });
                   });
               } else {
                   update(ref(db ,`post/${key}`),{
                       title:title,
                       post_content:post_content,
                       post_link:post_link
                   })
                   GetPostData()
               }
           }




    

     update_btn.addEventListener('click',Update_Form)

                 
}