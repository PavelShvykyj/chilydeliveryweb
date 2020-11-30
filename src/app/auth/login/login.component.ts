import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'
import { FirebaseAuth } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ui : firebaseui.auth.AuthUI;

  constructor(private fbAuth : AngularFireAuth,
              private router : Router,
              private ngZone : NgZone,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    const  uiConfig = {
      //signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      'queryParameterForSignInSuccessUrl': 'signInSuccessUrl',
      'signInSuccessUrl': 'orders',
      callbacks : {
        signInSuccessWithAuthResult : this.OnLoginSucsess.bind(this),
        signInFailure : this.OnLoginFail.bind(this)
      }
    }

    // this.fbAuth.auth
    // fbAuth : AngularFireAuth - объект оболочки из ангулара
    //  fbAuth.auth - свойство содержит объет firebase SDK
    // поэтому в функцию передаем именно свойство "auth"
    this.ui = new firebaseui.auth.AuthUI(this.fbAuth.auth);
    this.ui.start("#fb-ui-container",uiConfig);


  }

  ngOnDestroy() {
    this.ui.delete();
  }

  async OnLoginSucsess(resoult) {
    this._snackBar.open("Login successful", "OK",{duration: 2000, panelClass: ['snack-info']});  
    this.ngZone.run(() => this.router.navigateByUrl("orders"));
    
    //  let NewUsersAllowed : boolean = await this.db.NewUsersAllowed();

    
    //   if(resoult.additionalUserInfo.isNewUser && !NewUsersAllowed) {
        
    //     this.auth.LogOut();
    //     let snack = this._snackBar.open("Вы успешно зарегистрировались. Работа новых пользователей веремнно приостановлена.", "Ok", 
    //     {
    //       duration: 5000
    //     });
        
    //     snack.afterDismissed().subscribe(() => {
    //       this.ngZone.run(() => this.router.navigateByUrl("home"));
    //     });
    //   }  
    //   else {
    //       this._snackBar.open("Готовим данные ...", "Ок",{duration: 2000});
    //       console.log(resoult.user.uid);
    //       this.db.RootPathExist(resoult.user.uid).subscribe(res => {
    //         if (res) {
    //           /// await this.db.DeterminRootPath(resoult.user.uid); вариант без ожидания
    //           /// без ngZone ангулар не понимает что прошли изменения и не обновляет интерфейс
    //           this.ngZone.run(() => this.router.navigateByUrl("main"));
    //         } 
    //       },
    //       err => {
    //         this.auth.LogOut();
    //         this._snackBar.open("Извините что то пошло не так", "Try again",{duration: 2000});
    //         this.ngZone.run(() => this.router.navigateByUrl("home"));    
    //        })
    //   }
  }

  OnLoginFail(error) {
    alert("Login fail callback");
    // this.auth.LogOut();
    this._snackBar.open("Извините что то пошло не так", "Try again",{duration: 2000});
    this.ngZone.run(() => this.router.navigateByUrl("home"));    
  }
}



