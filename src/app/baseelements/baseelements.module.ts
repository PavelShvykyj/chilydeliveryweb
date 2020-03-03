import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LentaToolbarComponent } from './lenta-toolbar/lenta-toolbar.component';
import { MaterialsModule } from '../materials/materials.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CubToolbarComponent } from './cub-toolbar/cub-toolbar.component';

@NgModule({
  declarations: [LentaToolbarComponent, CubToolbarComponent],
  imports: [
    CommonModule,
    MaterialsModule,
    FlexLayoutModule
  ],
  exports: [LentaToolbarComponent,CubToolbarComponent]
})
export class BaseelementsModule { }
