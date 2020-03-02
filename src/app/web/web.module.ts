import { WebGoodListComponent } from './web.good.list/web.good.list.component';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {reducer} from './reducers';
import * as fromWeb from './reducers';
import { BaseelementsModule } from '../baseelements/baseelements.module';
import { MaterialsModule } from '../materials/materials.module';
import { WebGoodsDatasourseService } from './web.goods.datasourse.service';
import { WebEffects } from './web.effects';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [WebGoodListComponent],
  imports: [
    CommonModule,
    BaseelementsModule,
    FormsModule,
    MaterialsModule,
    EffectsModule.forFeature([WebEffects]),
    StoreModule.forFeature(fromWeb.webFeatureKey, reducer , { metaReducers: fromWeb.metaReducers })
  ],
  providers: [WebGoodsDatasourseService],
  exports: [WebGoodListComponent]
})
export class WebModule { }
