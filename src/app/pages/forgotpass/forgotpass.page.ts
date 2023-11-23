import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Animation, AnimationController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.page.html',
  styleUrls: ['./forgotpass.page.scss'],
})
export class ForgotpassPage implements OnInit {
  @ViewChild('button',{read:ElementRef})button:ElementRef;

  usuario = {
    email: ''
  };

  userForm: FormGroup;

  constructor(private toastController: ToastController, 
              private animationCtrl: AnimationController,
              private formBuilder: FormBuilder,
              private alertController: AlertController,
              ) {
                this.userForm = this.formBuilder.group({
                  email: [''],
                })
              }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Lo sentimos, esta opcion esta deshabilitada por el momento.',
      subHeader: 'Intentelo nuevamente mas tarde.',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message, icon){
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      icon,
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
    const flag = document.getElementById('form').textContent;
    if (flag === 'true'){
      this.presentAlert();
    }
    else{
      this.presentToast('bottom','Debe rellenar el campo','alert-circle-sharp');
    }
  }
  ngOnInit() {
  }
  
  onSubmit(){

    const expression: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

    if(!this.userForm.valid){
      this.presentToast('bottom', 'Debe rellenar el campo', 'alert-circle-sharp');
      return false;
    }
    else{
      let email = this.userForm.value['email'];
      if (!expression.test(email)){
        this.presentToast('bottom', 'El Email es invalido', 'alert-circle-sharp');
        return false;
      }
      else{
        this.presentAlert();
      }
    }
  }

}
