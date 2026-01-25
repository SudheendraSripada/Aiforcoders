import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from './tree-node.component';
import type { FileNode } from './tree-node.component';

@Component({
  selector: 'app-folder-structure',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  template: `
    <div class="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium mb-4 border border-yellow-500/20">
          Codebase Blueprint
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Folder Structure</h2>
        <p class="text-zinc-400 max-w-2xl">
          The project is organized into a modular structure with a clear separation of concerns between the core backend, clients, and the AI components.
        </p>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-mono text-sm">
        <div class="flex items-center gap-2 text-zinc-500 border-b border-zinc-800 pb-3 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <span>ai_for_coders/</span>
        </div>
        <ul>
          <app-tree-node [nodes]="structure"></app-tree-node>
        </ul>
      </div>
    </div>
  `
})
export class FolderStructureComponent {
  structure: FileNode[] = [
    { name: 'clients/', type: 'folder', icon: '📁', description: 'UI clients (Android, Desktop)', children: [
      { name: 'android/', type: 'folder', icon: '🤖', description: 'Kotlin/Jetpack Compose' },
      { name: 'desktop/', type: 'folder', icon: '💻', description: 'Electron/React' }
    ]},
    { name: 'core/', type: 'folder', icon: '📁', description: 'Main backend logic (FastAPI)', children: [
      { name: 'api/', type: 'folder', icon: '📁', description: 'API routes and schemas', children: [
        { name: 'endpoints/', type: 'folder', icon: '📁', description: 'Specific API endpoints', children: [
          { name: 'session.py', type: 'file', icon: '🐍', description: 'WebSocket & pairing routes'},
          { name: 'context.py', type: 'file', icon: '🐍', description: 'Routes for context management'}
        ]},
        { name: 'schemas.py', type: 'file', icon: '🐍', description: 'Pydantic data models'}
      ]},
      { name: 'logic/', type: 'folder', icon: '📁', description: 'Core business logic', children: [
        { name: 'session_manager.py', type: 'file', icon: '🐍', description: 'Manages client pairing & state'}
      ]},
      { name: 'persistence/', type: 'folder', icon: '📁', description: 'Database interaction layer', children: [
        { name: 'database.py', type: 'file', icon: '🐍', description: 'DB connection & session setup'},
        { name: 'models.py', type: 'file', icon: '🐍', description: 'Data models (SQLAlchemy ORM)'},
        { name: 'crud.py', type: 'file', icon: '🐍', description: 'Create, Read, Update, Delete functions'}
      ]},
      { name: 'main.py', type: 'file', icon: '🐍', description: 'FastAPI app entrypoint & router setup' },
    ]},
     { name: 'ai/', type: 'folder', icon: '📁', description: 'AI reasoning and API layer', children: [
      { name: 'brain.py', type: 'file', icon: '🧠', description: 'Core reasoning engine' },
      { name: 'gemini_adapter.py', type: 'file', icon: '✨', description: 'Gemini API interface' },
    ]},
    { name: 'config.py', type: 'file', icon: '⚙️', description: 'System configuration' },
    { name: 'run.sh', type: 'file', icon: '🚀', description: 'Application start script' },
  ];
}