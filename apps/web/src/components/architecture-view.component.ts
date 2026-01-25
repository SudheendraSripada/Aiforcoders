import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-architecture-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-12 pb-24">
      
      @if (section() === 'vision') {
        <section class="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-4 border border-blue-500/20">
              Project Vision
            </div>
            <h2 class="text-4xl font-bold tracking-tight text-white mb-4">AI for Coders</h2>
            <p class="text-xl text-zinc-400 leading-relaxed max-w-3xl">
              A production-grade, local-first developer assistant that acts as a senior engineer pair programmer. 
              It observes context, reasons about errors, and suggests fixes without taking autonomous control.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <h3 class="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                <span class="p-1 rounded bg-green-500/10 text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                Core Objectives
              </h3>
              <ul class="space-y-2 text-zinc-400 text-sm">
                <li class="flex gap-2"><span class="text-zinc-600">•</span> Analyze code, logs, and stack traces deeply</li>
                <li class="flex gap-2"><span class="text-zinc-600">•</span> Explain root causes, don't just patch them</li>
                <li class="flex gap-2"><span class="text-zinc-600">•</span> Support seamless multi-device pairing</li>
                <li class="flex gap-2"><span class="text-zinc-600">•</span> Behave like a senior engineer, not a script</li>
              </ul>
            </div>

            <div class="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <h3 class="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                <span class="p-1 rounded bg-red-500/10 text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                </span>
                Anti-Goals
              </h3>
              <ul class="space-y-2 text-zinc-400 text-sm">
                <li class="flex gap-2"><span class="text-zinc-600">•</span> No autonomous OS control</li>
                <li class="flex gap-2"><span class="text-zinc-600">•</span> No silent failures</li>
                <li class="flex gap-2"><span class="text-zinc-600">•</span> No "magic" logic hidden from the user</li>
                <li class="flex gap-2"><span class="text-zinc-600">•</span> No reliance on cloud for core logic (Local First)</li>
              </ul>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-medium text-white">Non-Negotiable Principles</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div class="text-blue-400 font-mono text-xs mb-2">01</div>
                <div class="font-medium text-zinc-200 mb-1">Backend Authority</div>
                <div class="text-xs text-zinc-500">The Python backend is the single source of truth. AI is advisory.</div>
              </div>
              <div class="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div class="text-blue-400 font-mono text-xs mb-2">02</div>
                <div class="font-medium text-zinc-200 mb-1">Explicit Failures</div>
                <div class="text-xs text-zinc-500">Never fail silently. Show the error. Explain the error.</div>
              </div>
              <div class="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div class="text-blue-400 font-mono text-xs mb-2">03</div>
                <div class="font-medium text-zinc-200 mb-1">Observability</div>
                <div class="text-xs text-zinc-500">Every subsystem must be debuggable. Logs are first-class citizens.</div>
              </div>
            </div>
          </div>
        </section>
      }

      @if (section() === 'architecture') {
        <section class="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div>
             <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium mb-4 border border-purple-500/20">
              High-Level Design
            </div>
            <h2 class="text-3xl font-bold text-white mb-6">System Architecture</h2>
            
            <div class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 relative overflow-hidden">
              <div class="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05]"></div>
              
              <div class="flex flex-col md:flex-row items-stretch justify-center gap-8 relative z-10">
                
                <div class="flex flex-col gap-4 min-w-[200px]">
                  <div class="text-xs font-mono text-zinc-500 uppercase text-center mb-2">Presentation Layer</div>
                  <div class="p-4 bg-zinc-800 rounded-lg border border-zinc-700 text-center shadow-lg">
                    <div class="font-bold text-zinc-200">Android Client</div>
                    <div class="text-xs text-zinc-500">Kotlin / Jetpack Compose</div>
                  </div>
                  <div class="p-4 bg-zinc-800 rounded-lg border border-zinc-700 text-center shadow-lg">
                    <div class="font-bold text-zinc-200">Desktop Client</div>
                    <div class="text-xs text-zinc-500">Electron / React</div>
                  </div>
                </div>

                <div class="hidden md:flex flex-col justify-center items-center gap-2">
                   <div class="h-px w-16 bg-gradient-to-r from-zinc-700 to-blue-900"></div>
                   <div class="text-[10px] text-zinc-500 font-mono">WS / HTTP</div>
                   <div class="h-px w-16 bg-gradient-to-r from-blue-900 to-zinc-700"></div>
                </div>

                <div class="flex flex-col gap-4 min-w-[240px]">
                   <div class="text-xs font-mono text-blue-500 uppercase text-center mb-2">Core System (Authority)</div>
                   <div class="p-6 bg-zinc-950 rounded-xl border border-blue-900/50 shadow-2xl relative">
                      <div class="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full blur-lg opacity-50"></div>
                      <div class="font-bold text-blue-100 text-lg mb-2">Backend Service</div>
                      <div class="space-y-2">
                        <div class="px-2 py-1 bg-blue-900/20 rounded text-xs text-blue-300 font-mono">FastAPI / Uvicorn</div>
                        <div class="px-2 py-1 bg-blue-900/20 rounded text-xs text-blue-300 font-mono">SQLite (Persistence)</div>
                        <div class="px-2 py-1 bg-blue-900/20 rounded text-xs text-blue-300 font-mono">Session Manager</div>
                      </div>
                   </div>
                </div>

                <div class="hidden md:flex flex-col justify-center items-center gap-2">
                   <div class="h-px w-16 bg-gradient-to-r from-zinc-700 to-purple-900"></div>
                   <div class="text-[10px] text-zinc-500 font-mono">Internal API</div>
                   <div class="h-px w-16 bg-gradient-to-r from-purple-900 to-zinc-700"></div>
                </div>

                <div class="flex flex-col gap-4 min-w-[200px]">
                   <div class="text-xs font-mono text-purple-500 uppercase text-center mb-2">Intelligence Layer</div>
                   <div class="p-4 bg-zinc-950 rounded-xl border border-purple-900/50 shadow-2xl">
                      <div class="font-bold text-purple-100 mb-2">AI Brain</div>
                      <div class="space-y-2">
                         <div class="px-2 py-1 bg-purple-900/20 rounded text-xs text-purple-300 font-mono">Gemini API</div>
                         <div class="px-2 py-1 bg-purple-900/20 rounded text-xs text-purple-300 font-mono">Local Reasoning Engine</div>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      }

      @if (section() === 'pairing') {
        <section class="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div>
             <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium mb-4 border border-green-500/20">
              Connectivity
            </div>
            <h2 class="text-3xl font-bold text-white mb-2">Pairing & Data Flow</h2>
            <p class="text-zinc-400 max-w-2xl">
              Clients connect to the backend via a secure WebSocket for real-time, bidirectional communication. This enables instant context sharing and multi-device synchronization.
            </p>
          </div>
          
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">
            <h3 class="text-lg font-semibold text-white">Client Pairing Flow</h3>
            <div class="flex items-center justify-between gap-4 p-4 bg-zinc-950 rounded-lg">
                <div class="text-center">
                  <div class="p-3 bg-zinc-800 border border-zinc-700 rounded-lg inline-block">📱</div>
                  <div class="text-xs mt-2 text-zinc-400">Client A</div>
                </div>
                <div class="flex-1 text-center">
                    <p class="text-sm text-blue-300 font-medium">1. Generate Pairing Code</p>
                    <div class="h-px bg-gradient-to-r from-zinc-800 via-blue-700 to-zinc-800 mt-1"></div>
                </div>
                <div class="text-center">
                  <div class="p-3 bg-zinc-800 border border-zinc-700 rounded-lg inline-block">💻</div>
                  <div class="text-xs mt-2 text-zinc-400">Backend</div>
                </div>
            </div>
            <div class="flex items-center justify-between gap-4 p-4 bg-zinc-950 rounded-lg">
                <div class="text-center">
                  <div class="p-3 bg-zinc-800 border border-zinc-700 rounded-lg inline-block">📱</div>
                  <div class="text-xs mt-2 text-zinc-400">Client A</div>
                </div>
                <div class="flex-1 text-center">
                    <p class="text-sm text-zinc-400 font-medium">2. Display QR / Code</p>
                    <div class="h-px bg-zinc-800 mt-1"></div>
                </div>
                 <div class="text-center">
                  <div class="p-3 bg-zinc-800 border border-zinc-700 rounded-lg inline-block">🖥️</div>
                  <div class="text-xs mt-2 text-zinc-400">Client B</div>
                </div>
            </div>
             <div class="flex items-center justify-between gap-4 p-4 bg-zinc-950 rounded-lg">
                <div class="text-center">
                  <div class="p-3 bg-zinc-800 border border-zinc-700 rounded-lg inline-block">🖥️</div>
                  <div class="text-xs mt-2 text-zinc-400">Client B</div>
                </div>
                <div class="flex-1 text-center">
                    <p class="text-sm text-green-400 font-medium">3. Enter Code & Establish WS</p>
                    <div class="h-px bg-gradient-to-r from-zinc-800 via-green-700 to-zinc-800 mt-1"></div>
                </div>
                <div class="text-center">
                  <div class="p-3 bg-zinc-800 border border-zinc-700 rounded-lg inline-block">💻</div>
                  <div class="text-xs mt-2 text-zinc-400">Backend</div>
                </div>
            </div>
          </div>
        </section>
      }
    </div>
  `,
})
export class ArchitectureViewComponent {
  section = input.required<'vision' | 'architecture' | 'pairing'>();
}
