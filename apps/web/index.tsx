import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './src/app.component';


bootstrapApplication(AppComponent)
  .catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.