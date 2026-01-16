import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FileNode {
  name: string;
  type: 'folder' | 'file';
  icon: string;
  children?: FileNode[];
  description?: string;
}

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule],
  // By recursively using <app-tree-node>, this component can render any depth of folder structure.
  template: `
    @for(node of nodes(); track node.name) {
      <li class="flex items-start py-1.5">
        <span class="w-8 text-zinc-600 pt-1">├─</span>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span [innerHTML]="node.icon" class="text-base"></span>
            <span class="text-zinc-300">{{ node.name }}</span>
            @if (node.description) {
              <span class="text-zinc-500 text-xs">- {{ node.description }}</span>
            }
          </div>
          @if (node.children && node.children.length > 0) {
            <ul class="pl-6 pt-1">
              <app-tree-node [nodes]="node.children"></app-tree-node>
            </ul>
          }
        </div>
      </li>
    }
  `
})
export class TreeNodeComponent {
  nodes = input.required<FileNode[]>();
}
