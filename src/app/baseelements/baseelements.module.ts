import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LentaToolbarComponent } from './lenta-toolbar/lenta-toolbar.component';
import { MaterialsModule } from '../materials/materials.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CubToolbarComponent } from './cub-toolbar/cub-toolbar.component';
import { DialogstringinputComponent } from './dialogstringinput/dialogstringinput.component';

@NgModule({
  declarations: [LentaToolbarComponent, CubToolbarComponent, DialogstringinputComponent],
  entryComponents:[DialogstringinputComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialsModule,
    FlexLayoutModule
  ],
  exports: [LentaToolbarComponent,CubToolbarComponent]
})
export class BaseelementsModule { }
