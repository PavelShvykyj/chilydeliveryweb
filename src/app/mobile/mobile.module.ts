import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileService } from './mobile.service';
import { StoreModule } from '@ngrx/store';
import * as fromMobile from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { MobileEffects } from './mobile.effects';
import { mobilereducer } from './reducers';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromMobile.mobileFeatureKey, mobilereducer, { metaReducers: fromMobile.metaReducers }),
    EffectsModule.forFeature([MobileEffects])
  ],
  providers: [MobileService]
})
export class MobileModule { }
