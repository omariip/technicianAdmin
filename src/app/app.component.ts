import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from '@firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private auth: Auth) {
    this.signIn();
  }

  async signIn() {
    signInWithEmailAndPassword(this.auth, "mobichanic@admin.com", "mobichanic")
    .then(() => {})
    .catch((e) => {console.log(e)});
  }
}
