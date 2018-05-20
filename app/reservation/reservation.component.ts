import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { View, Page } from 'tns-core-modules/ui/page/page';
import { AnimationDefinition, Animation } from 'tns-core-modules/ui/animation/animation';
import * as enums from "ui/enums";
import { ReservationService } from '~/services/reservation.service';
import { CouchbaseService } from '~/services/couchbase.service';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;

    content: View;

    isFormSubmited = false;

    docId: string = "reservations";

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService, 
        private page: Page,
        private reservationService: ReservationService,
        private couchbaseService: CouchbaseService,
        private vcRef: ViewContainerRef) {
            super(changeDetectorRef);

            this.reservation = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });
    }

    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });

    }

    ngOnInit() {

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text});
    }

    onSubmit() {
        console.log(JSON.stringify(this.reservation.value));

        this.content = <View>this.page.getViewById<View>('content');
        this.animate(this.content, 0, 0, 0.2, 500).then(
            () => {
                this.isFormSubmited = true;
                this.persistData();
                this.animate(this.content, 1, 1, 1, 500);
            }
        ).catch(error => console.log(error));
    }

    persistData() {
        let reservations: Array<any>;

        let doc = this.couchbaseService.getDocument(this.docId);
        if( doc == null) {
            this.couchbaseService.createDocument({"reservations": []}, this.docId);
        } else {
            reservations = doc.reservations;
        }

        reservations.push(this.reservation.value);
        this.couchbaseService.updateDocument(this.docId, {"reservations": reservations});

        console.log(reservations);
    }

    animate(targetView: View, 
                   scaleX: number,
                   scaleY: number, 
                   opacity: number,
                   duration: number
    ): Promise<any> {
        let animation: AnimationDefinition = {
            target: targetView,
            scale: {
                x: scaleX,
                y: scaleY
            },
            opacity: opacity,
            duration: duration,
            curve: enums.AnimationCurve.easeIn
        };
        
        let definitions = new Array<AnimationDefinition>();
        definitions.push(animation);

        let animationSet = new Animation(definitions);
        return animationSet.play();
    }
}