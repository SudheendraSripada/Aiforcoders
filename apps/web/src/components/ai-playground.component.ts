import { Component, signal, ChangeDetectionStrategy, computed, effect, ElementRef, viewChild, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleGenAI, Content } from '@google/genai';
import { marked } from 'marked';
import { ApiKeySetupComponent } from './api-key-setup.component';

const API_KEY_STORAGE_KEY = 'gemini-api-key';
const CHAT_HISTORY_KEY = 'gemini-chat-history';
const PROMPT_TEMPLATES_KEY = 'gemini-prompt-templates';


type KeyState = 'unknown' | 'validating' | 'valid' | 'invalid' | 'missing';

interface PromptExample {
  input: string;
  output: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  imagePreview?: string | null;
  validationStatus?: 'valid' | 'invalid' | 'none';
}

interface PromptTemplate {
  name: string;
  systemInstruction: string;
  examples: PromptExample[];
  temperature: number;
  selectedModel: string;
  useStructuredResponse: boolean;
  responseSchemaString: string;
}


@Component({
  selector: 'app-ai-playground',
  standalone: true,
  imports: [CommonModule, ApiKeySetupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-full flex flex-col bg-zinc-950">
      <header class="p-4 border-b border-zinc-800 shrink-0 flex justify-between items-center">
        <div>
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            AI Brain Prototype
          </h2>
          <p class="text-xs text-zinc-500 mt-1">
            Use prompt engineering techniques to get a structured response from the AI.
          </p>
        </div>
        @if(keyState() === 'valid') {
          <button (click)="clearApiKey()" class="text-xs text-zinc-400 hover:text-red-400 transition-colors px-3 py-1.5 border border-zinc-700 hover:border-red-600 rounded-md flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
             Clear API Key
          </button>
        }
      </header>
      
      <div class="flex-1 overflow-hidden">
        @switch (keyState()) {
          @case ('valid') {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full p-6">
              <!-- Left Column: Prompt Engineering -->
              <div class="flex flex-col gap-4 overflow-y-auto pr-2">
                
                <div class="p-3 border border-zinc-800 rounded-lg bg-zinc-900/50">
                  <h3 class="text-xs font-semibold uppercase text-zinc-500 tracking-wider mb-3">Prompt Templates</h3>
                  <div class="space-y-3">
                    <div class="flex gap-2">
                       <select #templateSelector
                                (change)="selectedTemplateName.set(templateSelector.value)"
                                [value]="selectedTemplateName()"
                                [disabled]="loading()"
                                class="flex-grow w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none disabled:opacity-50">
                          <option value="" disabled>Select a template...</option>
                          @for (template of savedTemplates(); track template.name) {
                            <option [value]="template.name">{{ template.name }}</option>
                          }
                       </select>
                       <button (click)="loadSelectedTemplate()" [disabled]="!selectedTemplateName() || loading()"
                                class="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
                         Load
                       </button>
                       <button (click)="deleteSelectedTemplate()" [disabled]="!selectedTemplateName() || loading()"
                                class="px-3 py-2 bg-red-900/30 hover:bg-red-900/60 text-red-300 text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
                         Delete
                       </button>
                    </div>
                    @if (isSavingTemplate()) {
                      <div class="flex gap-2 animate-in fade-in duration-300">
                          <input type="text" #newTemplateNameInput placeholder="Enter template name..." 
                                (input)="newTemplateName.set(newTemplateNameInput.value)"
                                (keydown.enter)="confirmSaveTemplate()"
                                (keydown.escape)="cancelSaveTemplate()"
                                class="flex-grow w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                          <button (click)="confirmSaveTemplate()" [disabled]="!newTemplateName()"
                                  class="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
                            Confirm
                          </button>
                           <button (click)="cancelSaveTemplate()"
                                  class="px-3 py-2 bg-zinc-600 hover:bg-zinc-500 text-zinc-200 text-xs rounded-md transition-colors font-semibold">
                            Cancel
                          </button>
                      </div>
                    } @else {
                      <button (click)="handleSaveTemplateClick()" [disabled]="loading()" class="w-full text-sm text-zinc-300 hover:text-white bg-zinc-700/50 hover:bg-zinc-700 rounded-lg py-2 transition-colors disabled:opacity-50">
                        Save current as template...
                      </button>
                    }
                  </div>
                </div>

                @if (availableModels().length > 1) {
                  <div>
                    <label for="model-selector" class="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Model</label>
                    <div class="relative mt-2">
                      <select 
                        id="model-selector"
                        #modelSelect
                        (change)="selectedModel.set(modelSelect.value)"
                        [value]="selectedModel()"
                        [disabled]="loading()"
                        class="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none pr-10 disabled:opacity-50"
                      >
                        @for(model of availableModels(); track model.name) {
                          <option [value]="model.name" [title]="model.description">{{ model.displayName }}</option>
                        }
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                }

                <div>
                  <div class="flex justify-between items-center">
                     <label for="temperature-slider" class="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Temperature</label>
                      <input 
                        type="number"
                        id="temperature-input"
                        [value]="temperature()"
                        (input)="temperature.set(($event.target as HTMLInputElement).valueAsNumber)"
                        [disabled]="loading()"
                        min="0" max="1" step="0.1"
                        class="w-16 bg-zinc-800 border border-zinc-700 rounded-md p-1 text-center text-xs text-zinc-200 disabled:opacity-50"
                      />
                  </div>
                   <input 
                    type="range" 
                    id="temperature-slider"
                    min="0" max="1" step="0.1" 
                    [value]="temperature()"
                    (input)="temperature.set(($event.target as HTMLInputElement).valueAsNumber)"
                    [disabled]="loading()"
                    class="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer mt-2 accent-blue-500 disabled:opacity-50"
                  />
                  <p class="text-xs text-zinc-500 mt-1">Controls randomness. Lower is more deterministic.</p>
                </div>

                <div>
                  <label class="text-xs font-semibold uppercase text-zinc-500 tracking-wider">System Instruction</label>
                  <textarea 
                    #systemInstructionTextarea
                    (input)="systemInstruction.set(systemInstructionTextarea.value)"
                    [value]="systemInstruction()"
                    [disabled]="loading()"
                    placeholder="e.g., You are a senior engineer specializing in code reviews."
                    class="w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none disabled:opacity-50" 
                    rows="3"></textarea>
                </div>

                <div class="space-y-3">
                  <h3 class="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Few-shot Examples</h3>
                  @for(example, i of examples(); track i) {
                    <div class="p-3 border border-zinc-800 rounded-lg bg-zinc-900/50 relative">
                      <button (click)="removeExample(i)" [disabled]="loading()" class="absolute -top-2 -right-2 p-1 bg-zinc-700 hover:bg-red-500 rounded-full text-white transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <label class="text-xs font-medium text-zinc-400">Example Input</label>
                      <textarea 
                        [value]="example.input"
                        (input)="updateExample(i, 'input', ($event.target as HTMLTextAreaElement).value)"
                        [disabled]="loading()"
                        placeholder="User input..."
                        class="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm text-zinc-200 resize-none font-mono disabled:opacity-50"
                        rows="4"></textarea>
                      <label class="text-xs font-medium text-zinc-400 mt-2 block">Example Output</label>
                      <textarea 
                        [value]="example.output"
                        (input)="updateExample(i, 'output', ($event.target as HTMLTextAreaElement).value)"
                        [disabled]="loading()"
                        placeholder="Expected model response..."
                        class="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm text-zinc-200 resize-none font-mono disabled:opacity-50"
                        rows="4"></textarea>
                    </div>
                  }
                  <button (click)="addExample()" [disabled]="loading()" class="w-full text-sm text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 border border-dashed border-blue-800/50 rounded-lg py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      + Add Example
                    </button>
                </div>

                <div class="space-y-2 py-2">
                  <div class="flex items-center justify-between">
                    <label for="structured-response-toggle" class="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Structured Response (JSON)</label>
                    <button id="structured-response-toggle" (click)="useStructuredResponse.set(!useStructuredResponse())"
                            [disabled]="loading()"
                            [class]="'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 ' + (useStructuredResponse() ? 'bg-blue-600' : 'bg-zinc-700')">
                        <span [class]="'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ' + (useStructuredResponse() ? 'translate-x-5' : 'translate-x-0')"></span>
                    </button>
                  </div>
                  @if (useStructuredResponse()) {
                    <div class="mt-2 animate-in fade-in duration-300">
                        <p class="text-xs text-zinc-500 mb-2">Define a JSON schema for the model's output. The model will be forced to respond in this format.</p>
                        <textarea #responseSchemaTextarea
                                  (input)="responseSchemaString.set(responseSchemaTextarea.value)"
                                  [value]="responseSchemaString()"
                                  [disabled]="loading()"
                                  placeholder="Enter a valid JSON schema..."
                                  class="w-full bg-zinc-900 border rounded-lg p-3 text-sm text-zinc-200 focus:ring-2 focus:border-blue-500 transition-all resize-y font-mono disabled:opacity-50"
                                  [class.border-zinc-800]="!responseSchemaError()"
                                  [class.border-red-500/50]="responseSchemaError()"
                                  [class.focus:ring-blue-500]="!responseSchemaError()"
                                  [class.focus:ring-red-500]="responseSchemaError()"
                                  rows="10"></textarea>
                        @if (responseSchemaError()) {
                            <p class="text-xs text-red-400 mt-2 p-2 bg-red-900/20 rounded-md">{{ responseSchemaError() }}</p>
                        }
                    </div>
                  }
                </div>

                <div class="space-y-2 py-2">
                  <div class="flex items-center justify-between">
                    <label for="structured-input-toggle" class="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Structured Input (JSON)</label>
                    <button id="structured-input-toggle" (click)="useStructuredInput.set(!useStructuredInput())"
                            [disabled]="loading()"
                            [class]="'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 ' + (useStructuredInput() ? 'bg-blue-600' : 'bg-zinc-700')">
                        <span [class]="'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ' + (useStructuredInput() ? 'translate-x-5' : 'translate-x-0')"></span>
                    </button>
                  </div>
                   @if (useStructuredInput()) {
                     <p class="text-xs text-zinc-500 animate-in fade-in duration-300">Provide the user prompt as a valid JSON object.</p>
                  }
                </div>

                <div class="space-y-2 py-2 border-t border-zinc-800">
                    <h3 class="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Code Analysis</h3>
                    @if (screenshotPreview()) {
                        <div class="animate-in fade-in duration-300 space-y-2">
                            <p class="text-xs text-zinc-500">Screenshot captured. Add a prompt below or use the default.</p>
                            <div class="relative group">
                                <img [src]="screenshotPreview()" alt="Screen Capture Preview" class="rounded-lg border border-zinc-700 max-h-48 w-full object-cover object-top" />
                                <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                     <button (click)="clearScreenshot()" class="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded-md font-semibold">Clear Screenshot</button>
                                </div>
                            </div>
                        </div>
                    } @else {
                        <button (click)="captureScreen()" [disabled]="loading()" class="w-full text-sm text-zinc-300 hover:text-white bg-zinc-700/50 hover:bg-zinc-700 rounded-lg py-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                            Capture Screen to Analyze Code
                        </button>
                    }
                </div>

                <div class="flex-grow flex flex-col">
                  <label class="text-xs font-semibold uppercase text-zinc-500 tracking-wider mb-2">User Prompt</label>
                  <textarea 
                      #promptTextarea
                      (input)="prompt.set(promptTextarea.value)"
                      (keydown)="handleKeydown($event)"
                      [value]="prompt()"
                      [disabled]="loading()"
                      [placeholder]="useStructuredInput() ? 'Enter a valid JSON object...' : (screenshotPreview() ? 'e.g., Find the bug in this code...' : 'Enter your prompt... (Ctrl+Enter to submit)')"
                      class="w-full flex-grow bg-zinc-900 border rounded-lg p-3 resize-none text-sm text-zinc-200 focus:ring-2 transition-all disabled:opacity-50"
                      [class.font-mono]="useStructuredInput()"
                      [class.border-zinc-800]="!promptJsonError()"
                      [class.border-red-500/50]="promptJsonError()"
                      [class.focus:ring-blue-500]="!promptJsonError()"
                      [class.focus:ring-red-500]="promptJsonError()"
                      ></textarea>
                  @if (promptJsonError()) {
                    <p class="text-xs text-red-400 mt-2 p-2 bg-red-900/20 rounded-md">{{ promptJsonError() }}</p>
                  }
                </div>
                  <button 
                    (click)="loading() ? stopGenerating() : generateContent()"
                    [disabled]="!loading() && (!prompt() && !screenshotPreview() || (useStructuredInput() && !!promptJsonError()))"
                    [class]="'w-full px-4 py-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 ' + (loading() ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed')">
                    @if (loading()) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                        <span>Stop Generating</span>
                    } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" class=" " width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 9.5 14 5.5"/><path d="m14 18.5-4-4"/><path d="m5 14-1.3-1.3a1 1 0 0 0-1.4 0L1 14"/><path d="m23 10-1.3-1.3a1 1 0 0 0-1.4 0L19 10"/><path d="m5 10 4 4"/><path d="m14 5.5 4 4"/></svg>
                        <span>Generate (Ctrl+Enter)</span>
                    }
                  </button>
              </div>

              <!-- Right Column: Chat History -->
              <div class="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col">
                 <div class="p-3 border-b border-zinc-800 flex justify-between items-center shrink-0">
                    <h3 class="text-sm font-semibold text-zinc-200 px-2">Conversation</h3>
                    <div class="flex items-center gap-2">
                      <button 
                        (click)="copyLastResponse()"
                        [disabled]="!lastModelResponse() || loading()"
                        class="px-2 py-1 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 text-xs rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          @if(copyButtonText() === 'Copy') {
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                          } @else {
                            <polyline points="20 6 9 17 4 12"/>
                          }
                        </svg>
                        {{ copyButtonText() }} Last
                      </button>
                      <button 
                        (click)="clearChat()" 
                        [disabled]="chatHistory().length === 0 || loading()"
                        class="px-2 py-1 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 text-xs rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        Clear Chat
                      </button>
                    </div>
                 </div>

                 <div #chatContainer (click)="handleContainerClick($event)" class="flex-1 overflow-y-auto p-4 space-y-6">
                    @if(error()) {
                      <div class="p-4 rounded-lg bg-red-900/50 border-m border-red-500/30 text-red-300 text-sm h-full m-2">
                        <h3 class="font-semibold mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                          An error occurred during generation:
                        </h3>
                        <div class="font-sans text-xs whitespace-pre-wrap mt-2 p-3 bg-zinc-950 rounded-md">{{ error() }}</div>
                      </div>
                    } @else if (chatHistory().length > 0) {
                      @for (message of chatHistory(); track $index) {
                        <div [class]="'flex items-start gap-3 ' + (message.role === 'user' ? 'justify-end' : '')">
                          @if (message.role === 'model') {
                            <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">AI</div>
                          }
                          <div [class]="'max-w-xl p-3 rounded-xl ' + (message.role === 'user' ? 'bg-blue-600/20 text-blue-200' : 'bg-zinc-800 text-zinc-300')">
                             @if (message.imagePreview) {
                                <img [src]="message.imagePreview" alt="User-provided screenshot" class="rounded-md border border-zinc-700/50 mb-2 max-h-48"/>
                             }
                            @if (message.content) {
                              <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
                            }
                            @if (message.role === 'model') {
                              <div class="prose prose-invert prose-sm max-w-none text-zinc-300 selection:bg-blue-500/30" [innerHTML]="parseMarkdown(message.content)"></div>
                              @if (loading() && $index === chatHistory().length - 1) {
                                @if (!message.content) {
                                  <div class="flex items-center gap-2 text-zinc-500 text-sm mt-2 animate-in fade-in duration-300">
                                      <svg class="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      <span>AI is thinking...</span>
                                  </div>
                                } @else {
                                  <div class="w-2 h-4 bg-blue-400 animate-pulse mt-2 ml-1"></div>
                                }
                              }
                            }
                            @if (message.validationStatus && message.validationStatus !== 'none') {
                              <div class="mt-3 pt-2 border-t border-zinc-700/50">
                                @switch(message.validationStatus) {
                                  @case('valid') {
                                    <div class="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-green-900/50 text-green-300 text-xs font-medium">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      JSON Validated
                                    </div>
                                  }
                                  @case('invalid') {
                                    <div class="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-red-900/50 text-red-300 text-xs font-medium">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                      Validation Failed
                                    </div>
                                  }
                                }
                              </div>
                            }
                          </div>
                           @if (message.role === 'user') {
                            <div class="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">YOU</div>
                          }
                        </div>
                      }
                    } @else {
                       <div class="flex flex-col items-center justify-center h-full text-center text-zinc-500 p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                        <h3 class="text-lg font-semibold text-zinc-300">Conversation Area</h3>
                        <p class="max-w-xs mt-1">The AI conversation will appear here once you submit a prompt.</p>
                      </div>
                    }
                 </div>
              </div>
            </div>
          }
          @case ('missing')
          @case ('invalid') {
            <app-api-key-setup (keySaved)="handleKeySaved($event)"></app-api-key-setup>
          }
          @case ('validating')
          @case ('unknown') {
            <div class="flex items-center justify-center h-full gap-3">
                <div class="w-8 h-8 border-4 border-zinc-700 border-t-blue-400 rounded-full animate-spin"></div>
                <span class="text-zinc-400 text-lg">
                  @if(keyState() === 'validating') {
                    Validating API Key...
                  } @else {
                    Initializing...
                  }
                </span>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class AiPlaygroundComponent {
  keyState = signal<KeyState>('unknown');
  systemInstruction = signal(`You are an expert software architect. Respond with concise, accurate, and structured information. Use markdown for formatting.`);
  examples = signal<PromptExample[]>([]);
  prompt = signal('');
  loading = signal(false);
  chatHistory = signal<ChatMessage[]>([]);
  error = signal('');
  copyButtonText = signal<'Copy' | 'Copied!'>('Copy');
  availableModels = signal<{name: string, displayName: string, description: string}[]>([]);
  selectedModel = signal<string>('');
  temperature = signal<number>(0.7);

  useStructuredResponse = signal(false);
  responseSchemaString = signal('');
  responseSchemaError = signal('');

  useStructuredInput = signal(false);
  promptJsonError = signal('');

  screenshotPreview = signal<string | null>(null);

  savedTemplates = signal<PromptTemplate[]>([]);
  selectedTemplateName = signal('');
  isSavingTemplate = signal(false);
  newTemplateName = signal('');

  private ai: GoogleGenAI | null = null;
  private controller: AbortController | null = null;
  private chatContainer = viewChild<ElementRef>('chatContainer');
  private readonly defaultSchema = `{
  "type": "ARRAY",
  "items": {
    "type": "OBJECT",
    "properties": {
      "recipeName": {
        "type": "STRING",
        "description": "The name of the cookie recipe."
      },
      "ingredients": {
        "type": "ARRAY",
        "description": "A list of ingredients for the recipe.",
        "items": { "type": "STRING" }
      }
    },
    "required": ["recipeName", "ingredients"]
  }
}`;
  private readonly defaultPromptJson = `{
  "query": "List top 3 sci-fi movies from the 90s.",
  "context": "User is interested in classic science fiction."
}`;

  lastModelResponse = computed(() => {
    const history = this.chatHistory();
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].role === 'model' && history[i].content) {
        return history[i].content;
      }
    }
    return null;
  });

  constructor() {
    this.responseSchemaString.set(this.defaultSchema);
    this.validateKeyOnLoad();
    this.loadTemplatesFromStorage();
    
    const renderer = new marked.Renderer();
    const originalCodeRenderer = renderer.code.bind(renderer);
    
    renderer.code = (code, lang, escaped) => {
        const renderedCode = originalCodeRenderer(code, lang, escaped);
        const copyButton = `<button class="copy-code-btn absolute top-2 right-2 p-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-md text-zinc-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Copy</button>`;
        return `<div class="code-wrapper relative group bg-zinc-950/50 rounded-lg">${copyButton}${renderedCode}</div>`;
    };

    marked.setOptions({
      gfm: true,
      breaks: true,
      sanitize: true,
      renderer
    });

    // Auto-scroll effect
    effect(() => {
        if (this.chatHistory() && this.chatContainer()) {
            this.scrollToBottom();
        }
    });

    // Save history to localStorage whenever it changes.
    effect(() => {
      if (this.keyState() === 'valid') {
        const history = this.chatHistory();
        if (!Array.isArray(history)) {
          console.warn('Chat history is not an array, skipping persistence.');
          return;
        }
        
        if (history.length > 0) {
          localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
        } else {
          localStorage.removeItem(CHAT_HISTORY_KEY);
        }
      }
    });

    // Validate response schema in real-time
    effect(() => {
      if (this.useStructuredResponse()) {
        this.validateSchema(this.responseSchemaString());
      } else {
        this.responseSchemaError.set('');
      }
    });

    // Validate prompt as JSON in real-time
    effect(() => {
      if (this.useStructuredInput()) {
        this.validatePromptJson(this.prompt());
      } else {
        this.promptJsonError.set('');
      }
    });

    // Handle toggling structured input
    effect(() => {
        const isStructured = this.useStructuredInput();
        if (isStructured && !this.prompt()) {
            this.prompt.set(this.defaultPromptJson);
        } else if (!isStructured && this.prompt() === this.defaultPromptJson) {
            this.prompt.set('');
        }
    });
  }

  handleContainerClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const copyButton = target.closest('.copy-code-btn');

    if (copyButton) {
        const codeWrapper = copyButton.closest('.code-wrapper');
        const codeElement = codeWrapper?.querySelector('code');
        if (codeElement) {
            navigator.clipboard.writeText(codeElement.innerText);
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        }
    }
  }

  private validatePromptJson(jsonString: string) {
    if (!jsonString.trim()) {
      this.promptJsonError.set('Prompt cannot be empty when structured input is enabled.');
      return;
    }
    try {
      JSON.parse(jsonString);
      this.promptJsonError.set('');
    } catch (e: any) {
      this.promptJsonError.set(`Invalid JSON: ${e.message}`);
    }
  }

  private validateSchema(schema: string) {
    if (!schema.trim()) {
      this.responseSchemaError.set('Schema cannot be empty.');
      return;
    }
    try {
      const parsed = JSON.parse(schema);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Schema must be a valid JSON object.');
      }
      this.responseSchemaError.set('');
    } catch (e: any) {
      this.responseSchemaError.set(`Invalid JSON: ${e.message}`);
    }
  }

  private scrollToBottom(): void {
    try {
        const container = this.chatContainer()?.nativeElement;
        if(container) {
            container.scrollTop = container.scrollHeight;
        }
    } catch (err) { console.error(err); }
  }

  parseMarkdown(content: string): string {
    return marked.parse(content) as string;
  }

  private async validateKeyOnLoad() {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!savedKey) {
      this.keyState.set('missing');
      return;
    }

    this.keyState.set('validating');
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${savedKey}`);
      if (!response.ok) {
        let errorMsg = `Validation failed with status: ${response.status}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMsg = errorData?.error?.message || JSON.stringify(errorData);
          } else {
             const textError = await response.text();
             if(textError && textError.includes('API key not valid')) {
                errorMsg = 'The stored API key is not valid. Please enter a new one.';
             } else {
                errorMsg = 'Received an unexpected response from the server. The key is likely invalid.'
             }
          }
        } catch (e) { 
          // Ignore parsing errors, the original status message is sufficient.
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      this.processModels(data.models);
      this.initializeAi(savedKey);
      this.loadChatHistory();
      this.keyState.set('valid');
    } catch (e: any) {
      console.error('API Key validation failed on load:', e);
      this.keyState.set('invalid');
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }

  private loadChatHistory() {
    try {
        const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);

        if (savedHistory) {
            const trimmedHistory = savedHistory.trim();
            // Only attempt to parse if it looks like a JSON array
            if (trimmedHistory.startsWith('[') && trimmedHistory.endsWith(']')) {
                 const history: unknown = JSON.parse(trimmedHistory);
                 if (Array.isArray(history)) {
                    this.chatHistory.set(history as ChatMessage[]);
                    return; // Success
                 }
            }
        }
        
        // If we reach here, data is missing, invalid, or corrupted. Reset state.
        this.chatHistory.set([]);
        localStorage.removeItem(CHAT_HISTORY_KEY);

    } catch (e) {
        console.error("Failed to load or parse chat history. Resetting state.", e);
        this.chatHistory.set([]);
        localStorage.removeItem(CHAT_HISTORY_KEY);
    }
}

  private processModels(models: any[]) {
    const supportedModels = models
        .filter((m: any) => m.supportedGenerationMethods.includes('generateContent'))
        .map((m: any) => ({
            name: m.name.replace('models/', ''),
            displayName: m.displayName,
            description: m.description,
        }));
    
    this.availableModels.set(supportedModels);

    const defaultFlash = supportedModels.find((m: any) => m.name === 'gemini-2.5-flash');
    if (defaultFlash) {
        this.selectedModel.set(defaultFlash.name);
    } else if (supportedModels.length > 0) {
        this.selectedModel.set(supportedModels[0].name);
    } else {
        this.error.set('No compatible text models found for this API key.');
        this.selectedModel.set('');
    }
  }
  
  async handleKeySaved(key: string) {
    this.initializeAi(key);
    try {
        this.keyState.set('validating');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        if (!response.ok) throw new Error('Could not fetch models for the new key.');
        const data = await response.json();
        this.processModels(data.models);
        this.keyState.set('valid');
    } catch (e) {
        console.error('Failed to fetch models for new key:', e);
        this.error.set('API Key is valid, but failed to fetch the model list.');
        this.keyState.set('invalid');
    }
  }

  private initializeAi(key: string) {
    this.ai = new GoogleGenAI({ apiKey: key });
  }

  clearApiKey() {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    this.ai = null;
    this.keyState.set('missing');
    this.chatHistory.set([]);
    this.error.set('');
    this.availableModels.set([]);
    this.selectedModel.set('');
  }

  addExample() {
    this.examples.update(e => [...e, { input: '', output: '' }]);
  }

  removeExample(index: number) {
    this.examples.update(e => e.filter((_, i) => i !== index));
  }

  updateExample(index: number, field: 'input' | 'output', value: string) {
    this.examples.update(e => {
      const newExamples = [...e];
      newExamples[index][field] = value;
      return newExamples;
    });
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      if (!this.loading() && (this.prompt() || this.screenshotPreview())) {
        this.generateContent();
      }
    }
  }

  private formatApiError(e: any): string {
    console.error("API Error:", e);
    if (e && typeof e.message === 'string') {
        if (e.message.includes('API key not valid')) {
            return 'Authentication Error: The provided API key is not valid or has been revoked. Please verify your key in Google AI Studio and try again.';
        }
        if (e.message.toLowerCase().includes('quota')) {
            return 'Quota Exceeded: You have surpassed your usage quota for the Gemini API. Please check your usage limits and billing status in your Google Cloud dashboard.';
        }
        if (e.message.toLowerCase().includes('billing')) {
            return 'Billing Issue: A billing-related problem is preventing the request. Please ensure that billing is enabled for your project in the Google Cloud Console.';
        }
        if (e.message.includes('429')) { // Too many requests
             return 'Rate Limit Exceeded: You are sending requests too quickly. Please wait a moment before trying again.';
        }
        return e.message;
    }
    return 'An unknown error occurred. Please check the browser console for more technical details.';
  }

  async generateContent() {
    if ((!this.prompt() && !this.screenshotPreview()) || !this.ai || !this.selectedModel()) return;

    if (this.useStructuredResponse() && this.responseSchemaError()) {
      this.error.set(`Cannot generate response. Please fix the JSON schema error: ${this.responseSchemaError()}`);
      return;
    }

    if (this.useStructuredInput() && this.promptJsonError()) {
      this.error.set(`Cannot generate response. Please fix the User Prompt JSON error: ${this.promptJsonError()}`);
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.controller = new AbortController();
    const wasStructuredRequest = this.useStructuredResponse();

    const userPrompt = this.prompt() || (this.screenshotPreview() ? 'Analyze the code in this screenshot. Identify potential bugs, suggest improvements, and explain your reasoning.' : '');
    const imagePreviewForHistory = this.screenshotPreview();
    
    this.chatHistory.update(h => [...h, { role: 'user', content: userPrompt, imagePreview: imagePreviewForHistory }]);
    this.prompt.set('');
    this.screenshotPreview.set(null); // Clear preview after submission

    this.chatHistory.update(h => [...h, { role: 'model', content: '', validationStatus: 'none' }]);

    try {
        const fewShotHistory: Content[] = this.examples()
          .filter(ex => ex.input.trim() && ex.output.trim())
          .flatMap(ex => [
            { role: 'user', parts: [{ text: ex.input }] },
            { role: 'model', parts: [{ text: ex.output }] }
        ]);
        
        const conversationHistory = this.chatHistory().slice(0, -2).map(m => ({
          role: m.role,
          parts: [{ text: m.content }] // Note: not resending images from history for now
        }));

        const userParts = [];
        if (imagePreviewForHistory) {
            const base64Data = imagePreviewForHistory.split(',')[1];
            userParts.push({ inlineData: { mimeType: 'image/png', data: base64Data } });
        }
        userParts.push({ text: userPrompt });

        const contents: Content[] = [
            ...fewShotHistory, 
            ...conversationHistory,
            { role: 'user', parts: userParts }
        ];
        
        const config: Record<string, any> = {
            systemInstruction: this.systemInstruction() || undefined,
            temperature: this.temperature()
        };

        if (wasStructuredRequest) {
          try {
            config.responseMimeType = 'application/json';
            config.responseSchema = JSON.parse(this.responseSchemaString());
          } catch (e) {
            console.error("Schema parsing failed just before API call:", e);
            this.error.set('A critical error occurred while parsing the JSON schema.');
            this.loading.set(false);
            this.chatHistory.update(h => h.slice(0, -1)); // remove placeholder
            return;
          }
        }
        
        const stream = await this.ai.models.generateContentStream({
            model: this.selectedModel(),
            contents: contents,
            config,
        });

        for await (const chunk of stream) {
            if (this.controller.signal.aborted) {
                console.log('Stream generation stopped by user.');
                break;
            }
            this.chatHistory.update(h => {
              const latestHistory = [...h];
              latestHistory[latestHistory.length - 1].content += chunk.text;
              return latestHistory;
            });
        }

    } catch (e: any) {
        if (e.name !== 'AbortError') {
             this.error.set(this.formatApiError(e));
             this.chatHistory.update(h => h.slice(0, -1));
        }
    } finally {
        this.loading.set(false);
        this.controller = null;

        if (wasStructuredRequest && !this.error()) {
            this.chatHistory.update(h => {
                const newHistory = [...h];
                if (newHistory.length === 0) return newHistory;

                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage.role === 'model' && lastMessage.content) {
                    try {
                        JSON.parse(lastMessage.content);
                        lastMessage.validationStatus = 'valid';
                    } catch (e) {
                        lastMessage.validationStatus = 'invalid';
                    }
                }
                return newHistory;
            });
        }
    }
  }

  stopGenerating() {
    if (this.controller) {
      this.controller.abort();
    }
  }

  copyLastResponse() {
    const contentToCopy = this.lastModelResponse();
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      this.copyButtonText.set('Copied!');
      setTimeout(() => this.copyButtonText.set('Copy'), 2000);
    }
  }

  clearChat() {
    this.chatHistory.set([]);
    this.error.set('');
  }

  async captureScreen() {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        
        video.onloadedmetadata = async () => {
            await video.play();

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
              context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
              const dataUrl = canvas.toDataURL('image/png');
              this.screenshotPreview.set(dataUrl);
            } else {
              throw new Error('Could not get canvas context');
            }

            stream.getTracks().forEach(track => track.stop());
        };

      } catch (err) {
        console.error("Screen capture error:", err);
        this.error.set('Screen capture was cancelled or failed. Please try again.');
        // Clear any lingering error message after a few seconds
        setTimeout(() => {
          if (this.error() === 'Screen capture was cancelled or failed. Please try again.') {
            this.error.set('');
          }
        }, 4000);
      }
  }

  clearScreenshot() {
      this.screenshotPreview.set(null);
  }

  // --- Prompt Template Methods ---
  private loadTemplatesFromStorage() {
    try {
        const templatesJson = localStorage.getItem(PROMPT_TEMPLATES_KEY);

        if (templatesJson) {
            const trimmedTemplates = templatesJson.trim();
            // Only attempt to parse if it looks like a JSON array
            if (trimmedTemplates.startsWith('[') && trimmedTemplates.endsWith(']')) {
                 const templates: unknown = JSON.parse(trimmedTemplates);
                 if (Array.isArray(templates)) {
                    this.savedTemplates.set(templates as PromptTemplate[]);
                    return; // Success
                 }
            }
        }
        
        // If we reach here, data is missing, invalid, or corrupted. Reset state.
        this.savedTemplates.set([]);
        localStorage.removeItem(PROMPT_TEMPLATES_KEY);

    } catch (e) {
        console.error("Failed to load or parse templates. Resetting state.", e);
        this.savedTemplates.set([]);
        localStorage.removeItem(PROMPT_TEMPLATES_KEY);
    }
  }

  private saveTemplatesToStorage() {
    try {
      localStorage.setItem(PROMPT_TEMPLATES_KEY, JSON.stringify(this.savedTemplates()));
    } catch (e) {
      console.error("Could not save prompt templates to localStorage", e);
    }
  }

  handleSaveTemplateClick() {
    this.isSavingTemplate.set(true);
    // Pre-fill with selected name if user might want to update
    const selected = this.selectedTemplateName();
    if (selected) {
      this.newTemplateName.set(selected);
    }
  }

  cancelSaveTemplate() {
    this.isSavingTemplate.set(false);
    this.newTemplateName.set('');
  }

  confirmSaveTemplate() {
    const name = this.newTemplateName().trim();
    if (!name) return;

    const newTemplate: PromptTemplate = {
      name: name,
      systemInstruction: this.systemInstruction(),
      examples: this.examples(),
      temperature: this.temperature(),
      selectedModel: this.selectedModel(),
      useStructuredResponse: this.useStructuredResponse(),
      responseSchemaString: this.responseSchemaString(),
    };

    const existingIndex = this.savedTemplates().findIndex(t => t.name === name);
    if (existingIndex > -1) {
      // Update existing
      this.savedTemplates.update(templates => {
        const newTemplates = [...templates];
        newTemplates[existingIndex] = newTemplate;
        return newTemplates;
      });
    } else {
      // Add new
      this.savedTemplates.update(templates => [...templates, newTemplate]);
    }
    
    this.saveTemplatesToStorage();
    this.selectedTemplateName.set(name);
    this.cancelSaveTemplate();
  }

  loadSelectedTemplate() {
    const name = this.selectedTemplateName();
    if (!name) return;

    const template = this.savedTemplates().find(t => t.name === name);
    if (template) {
      this.systemInstruction.set(template.systemInstruction);
      this.examples.set(template.examples);
      this.temperature.set(template.temperature);
      this.selectedModel.set(template.selectedModel);
      this.useStructuredResponse.set(template.useStructuredResponse);
      this.responseSchemaString.set(template.responseSchemaString);
    }
  }

  deleteSelectedTemplate() {
    const name = this.selectedTemplateName();
    if (!name) return;

    this.savedTemplates.update(templates => templates.filter(t => t.name !== name));
    this.saveTemplatesToStorage();
    this.selectedTemplateName.set('');
  }
}