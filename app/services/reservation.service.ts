import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { CouchbaseService } from '../services/couchbase.service';
import 'rxjs/add/operator/map';

@Injectable()
export class ReservationService {
    docId: string = "reservations";

    reservations: Array<any>;

    constructor(private dishservice: DishService,
                private couchbaseService: CouchbaseService) {
        this.reservations = [];

        let doc = this.couchbaseService.getDocument(this.docId);
        if( doc == null) {
            this.couchbaseService.createDocument({"reservations": []}, this.docId);
        } else {
            this.reservations = doc.reservations;
        }
    }

    hasReservation(id: number): boolean {
        return this.reservations.some(el => el === id);
    }

    addReservation(reservation: Array<any>): boolean {
        this.reservations.push(reservation);
        this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});

        console.log(this.reservations);
        return true;
    }
}