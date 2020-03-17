import { props } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalDBService } from './local-db.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[LocalDBService]
})
export class IdbModule { }
