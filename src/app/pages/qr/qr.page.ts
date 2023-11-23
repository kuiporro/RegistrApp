import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { SubjectCrudService } from 'src/app/services/subject-crud.service';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  rawDate = new Date()
  date = this.rawDate.getDate()+'/'+(this.rawDate.getMonth()+1)+'/'+this.rawDate.getFullYear()
  value = ""
  latitude: any;
  longitude:any;
  data: any;
  qrData: any;
  name: any;
  code: any;
  teacher:any;
  id: any;
  Subject: any[]
  constructor(private activatedRoute: ActivatedRoute,private router:Router, private subjectCrudService: SubjectCrudService) { 
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.queryParams.subscribe(paramas => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.qrData = this.router.getCurrentNavigation().extras.state.info;
        this.data = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }
  currentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude = coordinates.coords.latitude;
    this.longitude = coordinates.coords.longitude;
  };
  async fetchSubject(){
    await this.subjectCrudService.getSubject(this.id).subscribe((response) => {
      this.Subject = response
      this.name = this.Subject['name'];
      this.code = this.Subject['code'];
      this.teacher = this.Subject['teachersName'];
      this.value = (this.id+' | '+this.Subject['code']+' | '+this.date+' | '+this.latitude+','+this.longitude)
    })
  }

  dataToPage(path: string){
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.data
      }
    };
    this.router.navigate([path], navigationExtras)
  }

  ngOnInit() {
    this.currentPosition()
    this.fetchSubject()
  }

}
