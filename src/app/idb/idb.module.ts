import { props, StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalDBService } from './local-db.service';
import * as fromIdb from './reducers';
import { idbFeatureKey } from './reducers';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //StoreModule.forFeature(idbFeatureKey, reducer , { metaReducers: fromIdb.metaReducers })
  ],
  providers:[LocalDBService]
})
export class IdbModule { }
