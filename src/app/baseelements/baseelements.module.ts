import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LentaToolbarComponent } from './lenta-toolbar/lenta-toolbar.component';
import { MaterialsModule } from '../materials/materials.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [LentaToolbarComponent],
  imports: [
    CommonModule,
    MaterialsModule,
    FlexLayoutModule
  ],
  exports: [LentaToolbarComponent]
})
export class BaseelementsModule { }
