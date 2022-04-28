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
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { WebDirtyGoodListComponent } from './web.dirty.good.list/web.dirty.good.list.component';
import { WebGoodEditComponent } from './web-good-edit/web-good-edit.component';
import { SelectparentComponent } from './selectparent/selectparent.component';
import { WebFolderListComponent } from './web.folder.list/web.folder.list.component';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { WebgoodPictureComponent } from './webgood-picture/webgood-picture.component';
import { SelectpictureComponent } from './selectpicture/selectpicture.component';
import { PictServiseService } from './pict-servise.service';
import { ChoiceService } from './choiceservise.service';
import { HttpClientModule } from '@angular/common/http';
import { ChoicegoodsComponent } from './choicegoods/choicegoods.component';
import { ChoiceGoodsResolver } from './choice.goods.resolver';


@NgModule({
  declarations: [WebGoodListComponent,
                WebFolderListComponent,
                WebDirtyGoodListComponent,
                WebGoodEditComponent,
                SelectparentComponent,
                WebgoodPictureComponent,
                SelectpictureComponent,
                ChoicegoodsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    BaseelementsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    MaterialsModule,
    EffectsModule.forFeature([WebEffects]),
    StoreModule.forFeature(fromWeb.webFeatureKey, reducer , { metaReducers: fromWeb.metaReducers })
  ],
  entryComponents: [WebGoodEditComponent,SelectparentComponent,WebgoodPictureComponent,SelectpictureComponent],
  providers: [WebGoodsDatasourseService, PictServiseService,ChoiceService,ChoiceGoodsResolver],
  exports: [WebGoodListComponent,WebDirtyGoodListComponent]
})
export class WebModule { }
