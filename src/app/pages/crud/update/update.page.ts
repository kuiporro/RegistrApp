import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { UserCrudService } from '../../../services/user-crud.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  data: any;
  updateUserFg: FormGroup;
  Users: any = [];
  id: any;

  constructor(
    private auth: AuthService,
    private activeRoute: ActivatedRoute,
    private userCrudService: UserCrudService,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private router: Router,
    private zone: NgZone,
    private toastController: ToastController,
  ) { 
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activeRoute.queryParams.subscribe(paramas => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }

  ngOnInit() {
    this.fetchUser(this.id);
    this.updateUserFg = this.formBuilder.group({
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

  fetchUser(id) {
    this.userCrudService.getUser(id).subscribe((data) => {
      this.updateUserFg.setValue({
        rut: data['rut'],
        name: data['name'],
        suname: data['suname'],
        username: data['username'],
        email: data['email'],
        password: data['password'],
        isAdmin: data['isAdmin'],
        teacher: data['teacher'],
      });
    });
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

  dataToPage(path:string){
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.data
      }
    };
    this.router.navigate([path], navigationExtras)
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


  // problema al tratar de validar que el email, el rut y el username no sean igual a uno que ya exista, una solucion a esto seria dejar solo que se edite el email, ya que, el usuario no deberia poder editar su nickname ni su rut.

    onSubmit() {
      const expression: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

      if(!this.updateUserFg.valid){
        this.presentToast('bottom', 'Debe rellenar los campos', 'alert-circle-sharp');
        return false;
      }
      else{

        let rut = this.updateUserFg.value['rut'];
        let name = this.updateUserFg.value['name'];
        let suname = this.updateUserFg.value['suname'];
        let username = this.updateUserFg.value['username'];
        let email = this.updateUserFg.value['email'];
        let password = this.updateUserFg.value['password'];


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
            if (emailFilter.length != 0 && email != email){
              this.presentToast('bottom', 'Ya existe una cuenta registrada con este email', 'alert-circle-sharp');
              return false;
            }
            // validar rut repetido
            else if (rutFilter != 0 && rut!=rut){
              this.presentToast('bottom', 'Ya existe una cuenta registrada con este rut', 'alert-circle-sharp');
              return false;
            }
            // validar username repetido
            else if(usernameFilter != 0 && username != username){
              this.presentToast('bottom', 'El nombre de usuario esta ocupado', 'alert-circle-sharp');
              return false;
            }
            //crear usuario
            else{
              this.userCrudService.updateUser(this.id, this.updateUserFg.value)
              .subscribe(() => {
                this.updateUserFg.reset();
                this.dataToPage('profile');
              })
              return true;
            }
          }
        )
      }
    }
  }
}