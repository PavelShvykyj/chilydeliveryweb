import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialsModule } from '../materials/materials.module';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './reducers';
import { reducer } from './reducers';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MaterialsModule,
    StoreModule.forFeature(fromAuth.authFeatureKey, reducer, { metaReducers: fromAuth.metaReducers })
  ],
  providers: [AuthService]
})
export class AuthModule { }
