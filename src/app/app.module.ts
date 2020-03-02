import { MaterialsModule } from './materials/materials.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {RouterState, StoreRouterConnectingModule, routerReducer} from '@ngrx/router-store';

/////////////////   OWN CREATED
import { AppComponent } from './app.component';
import { FireService } from './services/fire.service';
import { OnecModule } from './onec/onec.module';
import { WebModule } from './web/web.module';
import { AuthModule } from './auth/auth.module';
import { ExchangeModule } from './exchange/exchange.module';
import { AppEffects } from './app.effects';
import { OptionsEffects } from './options.effects';
import { IsLoggedInGuard } from './isloged.guard';





@NgModule({
  declarations: [
    AppComponent
    
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    MaterialsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FlexLayoutModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([AppEffects,OptionsEffects]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal
    }),
    
    /////////////////   OWN CREATED
    OnecModule,
    WebModule,
    AuthModule,
    ExchangeModule
    
    
    

  ], 
  providers: [FireService,IsLoggedInGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
