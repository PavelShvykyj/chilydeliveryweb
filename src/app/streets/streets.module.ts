import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromStreets from './reducers';
import { streetreducer } from './reducers';
import { StreetsResolver } from './streets.resolver';
import { EffectsModule } from '@ngrx/effects';
import { StreetsDataSourseService } from './streets-data-sourse.service';
import { StreetEffects } from './streets.effects';



@NgModule({
  declarations: [],
  providers: [StreetsResolver,StreetsDataSourseService],
  imports: [
    CommonModule,
    EffectsModule.forFeature([StreetEffects]),
    StoreModule.forFeature(fromStreets.streetsFeatureKey, streetreducer, { metaReducers: fromStreets.metaReducers })
  ]
})
export class StreetsModule { }
