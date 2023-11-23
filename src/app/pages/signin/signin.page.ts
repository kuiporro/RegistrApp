import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Animation, AnimationController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  @ViewChild('button',{read:ElementRef})button:ElementRef;

  usuario = {
    email: '',
    password: '',
  };

  obj: any;
  

  constructor(private auth: AuthService, private toastController: ToastController, private router: Router,private animationCtrl: AnimationController) {}

  async presentToast(message, position: 'top' | 'middle' | 'bottom', icon){
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      icon: icon
    });

    await toast.present();
  }

  async validarForm(){
    const animation: Animation = this.animationCtrl.create()
    .addElement(this.button.nativeElement)
    .duration(1500)
    .keyframes([
      { offset: 0, transform: 'scale(1)', opacity: '0.5' },
      { offset: 0.5, transform: 'scale(0.8)', opacity: '1' },
      { offset: 1, transform: 'scale(1)', opacity: '0.5' },
      { offset: 1, transform: 'scale(1)', opacity: '1' }
    ]);
  await animation.play();
  }

  dataToPage(data){
    let navigationExtras: NavigationExtras = {
      state: {
        user: data
      }
    };
    this.router.navigate(['home'], navigationExtras)
  }

  ngOnInit() {
    // console.clear()
  }

  onSubmit(){

    const expression: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
    const email: string = this.usuario.email;
    const result: boolean = expression.test(email);

    if (!result){
      this.presentToast('Correo invalido', 'bottom', 'alert-circle-sharp');
    }
    else if (this.usuario.password.length < 6){
      this.presentToast('Contraseña invalida', 'bottom', 'alert-circle-sharp');
    }
    else{
      let flag = this.auth.auth(this.usuario.email, this.usuario.password);
      if (flag){
        this.presentToast('Credenciales invalidas', 'bottom', 'alert-circle-sharp');
       }
    }
  }
}
