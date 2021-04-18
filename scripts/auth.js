const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const createguide=document.querySelector('#create-form');
var output="";
var idd2;
auth.onAuthStateChanged(user => {
    if (user) {
      console.log('user logged in: ', user);
      console.log(user.uid);
      idd2=user.uid;
      db.collection("guide").where("idd","==",idd2).onSnapshot((snap)=>{
        snap.docs.forEach((doc)=>{
          console.log(doc.data().title)
            output+='<li><div class="collapsible-header grey lighten-4">'+doc.data().title+'<button onclick=deleterecord("'+doc.id+'")>x</button></div><div class="collapsible-body white">'+doc.data().content+'</div></li>';
          })
        document.querySelector("#guide-list").innerHTML=output;
        output="";
       setupUI(user);
    })
    } else {
      console.log('user logged out');
      output="";
      document.querySelector("#guide-list").innerHTML='<h1>Sign in to Check Guides</h1>';
      setupUI();
    }
  })
const sign=document.querySelector('#signup-form');
sign.addEventListener("submit",(e)=>{
    e.preventDefault();
    const email=sign["signup-email"].value;
    const pass=sign["signup-password"].value;
    //console.log(email,pass);

    auth.createUserWithEmailAndPassword(email,pass).then((cred)=>{
      return db.collection("users").doc(cred.user.uid).set({
        bio: sign["signup-bio"].value
      }) ; 
    }).then(()=>{
      console.log(cred.user);
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        sign.reset();
    })
})
document.querySelector("#logout").addEventListener("click",(e)=>{
    e.preventDefault();
    auth.signOut().then(()=>{
        console.log("sign out");
    });
})
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;
  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});
const setupUI = (user) => {
  if (user) {
    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
    document.querySelector(".account-details").innerHTML=`<h4>Email:${user.email}</h4>`;
    db.collection("users").doc(user.uid).get().then((doc)=>{
      console.log(doc.data());
      document.querySelector(".account-details").innerHTML=`<h4>Email:${user.email}</h4><h5>${doc.data().bio}</h5>`;
    })
  } else {
    // toggle user elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};
createguide.addEventListener("submit",(e)=>{
  e.preventDefault();
  db.collection("guide").add({
    idd: idd2,
    title: document.querySelector("#title").value,
    content: document.querySelector("#content").value
  }).then(()=>{
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createguide.reset();
  })
})
const deleterecord=(id)=>{
  db.collection("guide").doc(id).delete();
}