import { Component, OnInit } from '@angular/core';
import { SubjectCrudService } from 'src/app/services/subject-crud.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserCrudService } from 'src/app/services/user-crud.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  isModalOpen = false;
  Subjects: any = [];
  info: any;
  data: any;
  User: any[];
  Subscribes: any = [];
  subscribesNumber: any;
  number: any;
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  constructor(
    private subjectCrudService: SubjectCrudService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private alertCon : AlertController,
    private auth: AuthService,
    private userCrudService: UserCrudService,
  ) {
    this.activeRoute.queryParams.subscribe(paramas => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }

  dataToQR(id: string){
    let navigationExtras: NavigationExtras = {
      state: {
        info: this.info,
        user: this.data
      }
    };
    this.router.navigate(['qr/', id], navigationExtras)
  }

  ngOnInit() {
    this.auth.validate(this.data);

  }
  ionViewDidEnter() {
    this.subjectCrudService.getSubjects().subscribe(
      (response) => { this.Subjects = response }
    );
  }

  getUserAsist(id:string){
    this.userCrudService.getUser(this.data.id).subscribe(
      (response) => { 
        this.Subscribes = response
        this.subscribesNumber = this.Subscribes['asistencia'][id]
        this.isModalOpen = true;
        if (this.subscribesNumber === undefined){
          this.number = 0
          console.log(0)
        }else{
          this.number = this.subscribesNumber.length;
        }
      }
    );
  }


  dataToPage(path: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.data
      }
    };
    this.router.navigate([path], navigationExtras)
  }
  dataToEdit(id: string){
    let navigationExtras: NavigationExtras = {
      state: {
        subject: this.data
      }
    };
    this.router.navigate(['subupdate/',id], navigationExtras)
  }

  async deleteSubject(id) {
    const alert = await this.alertCon.create({
      header: 'Eliminar Asignatura',
      message: 'Seguro que desea borrar la asignatura?',
      buttons: [{
        text: 'Si',
        handler : () =>
        this.deleteSubjectServ(id)
      },'no'],
    });
    await alert.present();
  } 

  async confirmacion() {
    const alert = await this.alertCon.create({
      header: 'Asignatura Borrada',
      message: 'la asignatura ya fue eliminada',
      buttons: ['Entendido'],
    });
    await alert.present();
  } 

  deleteSubjectServ(id) { 
    this.subjectCrudService.deleteSubject(id).subscribe(r => console.log(id));
    this.confirmacion();
    this.ionViewDidEnter();
  }
}