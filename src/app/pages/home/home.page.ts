import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { MenuController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  handlerMessage = '';
  roleMessage = '';
  data: any;
  code: any;
  latitude:any;
  longitude:any;
  

  constructor(private auth: AuthService, private activeRoute: ActivatedRoute, private router: Router ,private menu: MenuController, private alertController: AlertController) {
    this.activeRoute.queryParams.subscribe(paramas => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }

  currentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude = coordinates.coords.latitude;
    this.longitude = coordinates.coords.longitude;
  };
  async QRData() {
    const alert = await this.alertController.create({
      // header: 'Please enter your info (your position is: latitude:'+this.latitude.toString()+' longitude:'+this.longitude.toString()+')',
      buttons: [
        {
            text: 'OK',
            handler: data => {
                console.log(JSON.stringify(data)); //to see the object
                console.log(data.QRCode);
                console.log(data.date);
            }
        }
      ],
      inputs: [
        {
          name:'QRCode',
          placeholder: 'QRCode',
          attributes: {
            maxlength: 8,
          },
        },
        {
          name:'date',
          type: 'date',
          placeholder: 'Date',
          min: 1,
          max: 100,
        }
      ],
    });
    await alert.present();
  }

  async openCamera(){
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      });
      console.log(image);
  };


  dataToPage(page:string){
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.data
      }
    };
    this.router.navigate([page], navigationExtras)
  }

  async presentAlertExit(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Si',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'Alerta confirmeda';
            this.router.navigate(['/signin']);
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alerta canceleda';
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }

  config(){
    console.log('configuraciones');
  }

  openMenu() {
    this.menu.enable(true,'first');
    this.menu.open('first');
  }

  ngOnInit() {
  this.auth.validate(this.data);
  }

  // scan(){
  //   this.barcodeScanner.scan().then(barcodeData => {
  //     this.code = barcodeData.text;
  //     console.log('Barcode Data', this.code);
  //     this.code = barcodeData.text;
  //   }).catch(err => { console.log('Eroor', err);});
  // }
}

