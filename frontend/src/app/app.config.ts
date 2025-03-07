import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { appRoutes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes)]
}
