import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Animation, AnimationController } from '@ionic/angular';
import { UserCrudService } from 'src/app/services/user-crud.service';
  

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  userForm: FormGroup;
  Users: any = [];

  @ViewChild('button',{read:ElementRef})button:ElementRef;
  usuario = {
    rut: '',
    name: '',
    suname: '',
    username: '',
    password: '',
    email: '',
  }


  constructor(private router: Router, private toastController: ToastController, private animationCtrl: AnimationController, private formBuilder: FormBuilder, private zone: NgZone, private userCrudService: UserCrudService) {
    this.userForm = this.formBuilder.group({
      rut: [''],
      name: [''],
      suname: [''],
      username: [''],
      email: [''],
      password: [''],
      isAdmin: [''],
      teacher: [''],
    })
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
      this.presentToast('bottom', 'Verifique su email', 'mail-sharp');
    }
    else{
      this.presentToast('bottom', 'Debe rellenar los campos', 'alert-circle-sharp');
    }
}

  ngOnInit() {
  }

  validaRut(rutCompleto:any) {
    rutCompleto = rutCompleto.replace("‐","-");
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
      return false;
    var tmp 	= rutCompleto.split('-');
    var digv	= tmp[1]; 
    var rut 	= tmp[0];
    if ( digv == 'K' ) digv = 'k' ;
    
    return (this.dv(rut) == digv );
  }

  dv (T:any){
    var M=0,S=1;
    for(;T;T=Math.floor(T/10))
      S=(S+T%10*(9-M++%6))%11;
    return S?S-1:'k';
  }

    onSubmit(){

      const expression: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

      if(!this.userForm.valid){
        this.presentToast('bottom', 'Debe rellenar los campos', 'alert-circle-sharp');
        return false;
      }
      else{

        let rut = this.userForm.value['rut'];
        let name = this.userForm.value['name'];
        let suname = this.userForm.value['suname'];
        let username = this.userForm.value['username'];
        let email = this.userForm.value['email'];
        let password = this.userForm.value['password'];
        this.userForm.value['isAdmin'] = false;
        this.userForm.value['teacher'] = false;

        //validar rut
        if (rut.length!=10 || !this.validaRut(rut)){
          this.presentToast('bottom', 'El Rut es invalido', 'alert-circle-sharp');
          return false;
        }

        //validar nombre
        else if (name.length<3){
          this.presentToast('bottom', 'El Nombre es invalido', 'alert-circle-sharp');
          return false;
        }

        //validar apellido
        else if (suname.length<4){
          this.presentToast('bottom', 'El Apellido es invalido', 'alert-circle-sharp');
          return false;
        }

        //validar username
        else if (username.length<5){
          this.presentToast('bottom', 'El Nombre de Usuario es invalido', 'alert-circle-sharp');
          return false;
        }

        //validar email bien escrito
        
        else if (!expression.test(email)){
          this.presentToast('bottom', 'El Email es invalido', 'alert-circle-sharp');
          return false;
        }

        //validar password
        else if (password.length<6){
          this.presentToast('bottom', 'La contraseña es invalida', 'alert-circle-sharp');
          return false;
        }

         //validar que el email, rut y username no se repitan
        else{   
        this.userCrudService.getUsers().subscribe((response) => {
          this.Users = response
          let emailFilter = this.Users.filter(obj => obj.email === email);
          let rutFilter = this.Users.filter(obj => obj.rut === rut);
          let usernameFilter = this.Users.filter(obj => obj.username === username);
            // validar email repetido
            if (emailFilter.length != 0){
              this.presentToast('bottom', 'Ya existe una cuenta registrada con este email', 'alert-circle-sharp');
              return false;
            }
            // validar rut repetido
            else if (rutFilter != 0){
              this.presentToast('bottom', 'Ya existe una cuenta registrada con este rut', 'alert-circle-sharp');
              return false;
            }
            // validar username repetido
            else if(usernameFilter != 0){
              this.presentToast('bottom', 'El nombre de usuario esta ocupado', 'alert-circle-sharp');
              return false;
            }
            //crear usuario
            else{
                this.userCrudService.createUser(this.userForm.value)
                .subscribe((response) => {
                  this.zone.run(() => {
                    this.userForm.reset();
                    this.presentToast('bottom', 'Registrado correctamente', 'checkmark-circle-outline');
                    this.router.navigate(['/list']);
                  })
                })
              return true;
            }
          }
        )
      }
    }
  }
}
