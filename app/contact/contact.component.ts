import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import 'rxjs/add/operator/switchMap';
import { DrawerPage } from '~/shared/drawer/drawer.page';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Email from 'nativescript-email';
import * as Phone from 'nativescript-phone';

@Component({
  selector: 'app-contactus',
    moduleId: module.id,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactUsComponent extends DrawerPage {
  errMess: string;

  constructor(private routerExtensions: RouterExtensions, 
              private changeDetectorRef:ChangeDetectorRef,
              private fonticon: TNSFontIconService) 
  { 
        super(changeDetectorRef);
  }

  sendEmail() {
    Email.available()
      .then((avail: boolean) => {
        if (avail) {
          Email.compose({
            to: ['confusion@food.net'],
            subject: '[ConFusion]: Query',
            body: 'Dear Sir/Madam:'
          });
        }
        else
          console.log('No Email Configured');
      });
  }

  callRestaurant() {
    console.log('Calling...');
    Phone.dial("996868616", true);
  }
}