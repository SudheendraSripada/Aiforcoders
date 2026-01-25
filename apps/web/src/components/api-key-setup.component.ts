import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-key-setup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-full p-8 text-center bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-xl">
      <div class="max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-zinc-500 mb-4"><path d="M12 15a6 6 0 0 0 3.5-10.7A6 6 0 0 0 8.3 9.8"/><path d="m12 15-3.5 3.5a6 6 0 0 0 8.5 8.5l3.5-3.5"/><path d="m22 2-3 3"/><path d="m2 22 3-3"/></svg>
        <h2 class="text-2xl font-bold text-white mb-2">Gemini API Key Required</h2>
        <p class="text-zinc-400 mb-6">
          To use the AI Brain Prototype, please enter your Google Gemini API key. Your key is stored securely in your browser's local storage and is not sent to any server but Google's.
        </p>
        <div class="flex gap-2">
          <input 
            #apiKeyInput
            type="password"
            placeholder="Enter your API key..."
            [disabled]="isValidating()"
            class="flex-grow bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
          >
          <button 
            (click)="validateAndSaveKey(apiKeyInput.value)"
            [disabled]="isValidating()"
            class="px-5 py-2 w-40 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
            @if (isValidating()) {
              <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Validating...</span>
            } @else {
              <span>Save & Continue</span>
            }
          </button>
        </div>
        @if (validationError()) {
          <p class="text-xs text-red-400 mt-3 text-left p-2 bg-red-900/20 border border-red-500/20 rounded-md">{{ validationError() }}</p>
        }
        <p class="text-xs text-zinc-500 mt-4">
          You can get a free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-blue-400 hover:underline">Google AI Studio</a>.
        </p>
      </div>
    </div>
  `,
})
export class ApiKeySetupComponent {
  keySaved = output<string>();
  isValidating = signal(false);
  validationError = signal('');

  async validateAndSaveKey(key: string) {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      this.validationError.set('API key cannot be empty.');
      return;
    }

    this.isValidating.set(true);
    this.validationError.set('');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${trimmedKey}`);
      
      if (!response.ok) {
        let errorMsg = `Validation failed: ${response.status} ${response.statusText}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMsg = errorData?.error?.message || JSON.stringify(errorData);
          } else {
            const textError = await response.text();
            if (textError) {
              errorMsg = textError;
            }
          }
        } catch (e) {
          // Ignore parsing errors, the original status message is sufficient.
        }
        throw new Error(errorMsg);
      }
      
      localStorage.setItem('gemini-api-key', trimmedKey);
      this.keySaved.emit(trimmedKey);

    } catch (e: any) {
      const message = e.message || 'An unknown error occurred during validation.';
      this.validationError.set(`API Key is not valid. Reason: ${message}`);
      console.error('API Key Validation Error:', e);
    } finally {
      this.isValidating.set(false);
    }
  }
}
