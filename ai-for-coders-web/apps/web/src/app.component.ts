
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchitectureViewComponent } from './components/architecture-view.component';
import { FolderStructureComponent } from './components/folder-structure.component';
import { AiPlaygroundComponent } from './components/ai-playground.component';

type Tab = 'vision' | 'architecture' | 'folders' | 'pairing' | 'playground';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ArchitectureViewComponent, FolderStructureComponent, AiPlaygroundComponent],
  template: `
    <div class="flex h-screen w-full bg-zinc-950 text-zinc-200">
      <!-- Sidebar -->
      <aside class="w-64 border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0">
        <div class="p-6 border-b border-zinc-800">
          <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">AI for Coders</h1>
          <p class="text-xs text-zinc-500 mt-1 uppercase tracking-wider">System Architect</p>
        </div>
        
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <button 
            (click)="activeTab.set('vision')"
            [class]="activeTab() === 'vision' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'"
            class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Vision & Principles
          </button>

          <button 
            (click)="activeTab.set('architecture')"
            [class]="activeTab() === 'architecture' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'"
            class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            System Architecture
          </button>

          <button 
            (click)="activeTab.set('folders')"
            [class]="activeTab() === 'folders' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'"
            class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
            Folder Structure
          </button>

          <button 
            (click)="activeTab.set('pairing')"
            [class]="activeTab() === 'pairing' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'"
            class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Pairing & Data Flow
          </button>
          
          <div class="h-px bg-zinc-800 my-2"></div>
          
          <button 
            (click)="activeTab.set('playground')"
            [class]="activeTab() === 'playground' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'"
            class="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between">
            <span class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              <span>AI Brain Prototype</span>
            </span>
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
          </button>
        </nav>

        <div class="p-4 border-t border-zinc-800">
           <div class="flex items-center gap-3 px-2">
             <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs">CTO</div>
             <div class="flex flex-col">
               <span class="text-xs font-medium text-zinc-300">System Architect</span>
               <span class="text-[10px] text-zinc-500">v1.0.0-draft</span>
             </div>
           </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto bg-zinc-950 relative">
        @if (activeTab() === 'vision') {
          <div class="max-w-4xl mx-auto p-8 animate-in fade-in duration-300">
            <app-architecture-view section="vision"></app-architecture-view>
          </div>
        }
        @if (activeTab() === 'architecture') {
          <div class="max-w-6xl mx-auto p-8 animate-in fade-in duration-300">
             <app-architecture-view section="architecture"></app-architecture-view>
          </div>
        }
        @if (activeTab() === 'folders') {
          <div class="max-w-6xl mx-auto p-8 animate-in fade-in duration-300">
             <app-folder-structure></app-folder-structure>
          </div>
        }
        @if (activeTab() === 'pairing') {
          <div class="max-w-5xl mx-auto p-8 animate-in fade-in duration-300">
             <app-architecture-view section="pairing"></app-architecture-view>
          </div>
        }
        @if (activeTab() === 'playground') {
           <app-ai-playground></app-ai-playground>
        }
      </main>
    </div>
  `
})
export class AppComponent {
  activeTab = signal<Tab>('playground');
}
