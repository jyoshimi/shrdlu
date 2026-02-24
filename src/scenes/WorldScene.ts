import Phaser from 'phaser';
import { WorldManager } from '../systems/WorldManager';
import { BlockObject } from '../entities/BlockObject';
import { CommandParser } from '../systems/CommandParser';

export class WorldScene extends Phaser.Scene {
  private world!: WorldManager;
  private parser!: CommandParser;
  private graphics!: Phaser.GameObjects.Graphics;
  private table!: Phaser.GameObjects.Graphics;
  private cameraAngle = 225;
  private cameraDistance = 600;
  private selectedObject: BlockObject | null = null;
  private centerX = 0;
  private centerY = 0;

  constructor() {
    super({ key: 'WorldScene' });
  }

  create(): void {
    this.world = new WorldManager();
    this.parser = new CommandParser(this.world);

    this.cameras.main.setBackgroundColor('#000000');
    
    this.updateCenter();

    this.table = this.add.graphics();
    this.graphics = this.add.graphics();

    this.setupInput();
    
    this.scale.on('resize', this.handleResize, this);
    
    this.render();

    this.addMessage('system', 'Welcome to SHRDLU. Type a command to interact with the blocks world.');
  }

  private updateCenter(): void {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  private handleResize(): void {
    this.updateCenter();
    this.render();
  }

  private setupInput(): void {
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: any[], _deltaX: number, deltaY: number) => {
      this.cameraDistance += deltaY * 0.5;
      this.cameraDistance = Phaser.Math.Clamp(this.cameraDistance, 400, 1200);
      this.render();
    });

    let isDragging = false;
    let lastX = 0;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      isDragging = true;
      lastX = pointer.x;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (isDragging) {
        const deltaX = pointer.x - lastX;
        this.cameraAngle += deltaX * 0.5;
        lastX = pointer.x;
        this.render();
      }
    });

    this.input.on('pointerup', () => {
      isDragging = false;
    });
  }

  private project3D(x: number, y: number, z: number): { x: number; y: number } {
    const angleRad = (this.cameraAngle * Math.PI) / 180;
    const scale = 800 / this.cameraDistance;

    const rotX = x * Math.cos(angleRad) - y * Math.sin(angleRad);
    const rotY = x * Math.sin(angleRad) + y * Math.cos(angleRad);

    const screenX = this.centerX + rotX * scale;
    const screenY = this.centerY - z * scale + rotY * scale * 0.5;

    return { x: screenX, y: screenY };
  }

  private render(): void {
    this.graphics.clear();
    this.table.clear();

    this.renderTable();

    const sortedObjects = [...this.world.objects].sort((a, b) => {
      const angleRad = (this.cameraAngle * Math.PI) / 180;
      const aDepth = a.position.x * Math.sin(angleRad) + a.position.y * Math.cos(angleRad);
      const bDepth = b.position.x * Math.sin(angleRad) + b.position.y * Math.cos(angleRad);
      return aDepth - bDepth;
    });

    for (const obj of sortedObjects) {
      this.renderObject(obj);
    }
  }

  private renderTable(): void {
    const w = this.world.tableWidth / 2;
    const d = this.world.tableDepth / 2;

    const corners = [
      this.project3D(-w, -d, 0),
      this.project3D(w, -d, 0),
      this.project3D(w, d, 0),
      this.project3D(-w, d, 0),
    ];

    this.table.lineStyle(2, 0x00ff00, 0.5);
    this.table.beginPath();
    this.table.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) {
      this.table.lineTo(corners[i].x, corners[i].y);
    }
    this.table.closePath();
    this.table.strokePath();
  }

  private renderObject(obj: BlockObject): void {
    const isSelected = this.selectedObject === obj;
    
    if (obj.type === 'block') {
      this.renderBlock(obj, isSelected);
    } else if (obj.type === 'pyramid') {
      this.renderPyramid(obj, isSelected);
    } else if (obj.type === 'ball') {
      this.renderBall(obj, isSelected);
    }
  }


  private renderBlock(obj: BlockObject, isSelected: boolean): void {
    const w = obj.width / 2;
    const h = obj.height;
    const d = obj.depth / 2;

    const base = [
      this.project3D(obj.position.x - w, obj.position.y - d, obj.position.z),
      this.project3D(obj.position.x + w, obj.position.y - d, obj.position.z),
      this.project3D(obj.position.x + w, obj.position.y + d, obj.position.z),
      this.project3D(obj.position.x - w, obj.position.y + d, obj.position.z),
    ];

    const top = [
      this.project3D(obj.position.x - w, obj.position.y - d, obj.position.z + h),
      this.project3D(obj.position.x + w, obj.position.y - d, obj.position.z + h),
      this.project3D(obj.position.x + w, obj.position.y + d, obj.position.z + h),
      this.project3D(obj.position.x - w, obj.position.y + d, obj.position.z + h),
    ];

    const lineWidth = isSelected ? 3 : 2;
    const lineColor = isSelected ? 0xffff00 : 0x00ff00;

    this.graphics.lineStyle(lineWidth, lineColor, 1);

    this.graphics.beginPath();
    this.graphics.moveTo(base[0].x, base[0].y);
    for (let i = 1; i < base.length; i++) {
      this.graphics.lineTo(base[i].x, base[i].y);
    }
    this.graphics.closePath();
    this.graphics.strokePath();

    this.graphics.beginPath();
    this.graphics.moveTo(top[0].x, top[0].y);
    for (let i = 1; i < top.length; i++) {
      this.graphics.lineTo(top[i].x, top[i].y);
    }
    this.graphics.closePath();
    this.graphics.strokePath();

    for (let i = 0; i < 4; i++) {
      this.graphics.beginPath();
      this.graphics.moveTo(base[i].x, base[i].y);
      this.graphics.lineTo(top[i].x, top[i].y);
      this.graphics.strokePath();
    }
  }

  private renderPyramid(obj: BlockObject, isSelected: boolean): void {
    const w = obj.width / 2;
    const h = obj.height;
    const d = obj.depth / 2;

    const base = [
      this.project3D(obj.position.x - w, obj.position.y - d, obj.position.z),
      this.project3D(obj.position.x + w, obj.position.y - d, obj.position.z),
      this.project3D(obj.position.x + w, obj.position.y + d, obj.position.z),
      this.project3D(obj.position.x - w, obj.position.y + d, obj.position.z),
    ];

    const apex = this.project3D(obj.position.x, obj.position.y, obj.position.z + h);

    const lineWidth = isSelected ? 3 : 2;
    const lineColor = isSelected ? 0xffff00 : 0x00ff00;

    this.graphics.lineStyle(lineWidth, lineColor, 1);

    this.graphics.beginPath();
    this.graphics.moveTo(base[0].x, base[0].y);
    for (let i = 1; i < base.length; i++) {
      this.graphics.lineTo(base[i].x, base[i].y);
    }
    this.graphics.closePath();
    this.graphics.strokePath();

    for (let i = 0; i < 4; i++) {
      this.graphics.beginPath();
      this.graphics.moveTo(base[i].x, base[i].y);
      this.graphics.lineTo(apex.x, apex.y);
      this.graphics.strokePath();
    }
  }

  private renderBall(obj: BlockObject, isSelected: boolean): void {
    const center = this.project3D(obj.position.x, obj.position.y, obj.position.z + obj.height / 2);
    const radius = obj.width / 2;

    const lineWidth = isSelected ? 3 : 2;
    const lineColor = isSelected ? 0xffff00 : 0x00ff00;

    this.graphics.lineStyle(lineWidth, lineColor, 1);
    this.graphics.strokeCircle(center.x, center.y, radius);
  }

  public executeCommand(command: string): void {
    this.addMessage('user', `> ${command}`);
    const response = this.parser.parse(command);
    this.addMessage('system', response);
    this.render();
  }

  public resetWorld(): void {
    this.world.reset();
    this.parser = new CommandParser(this.world);
    this.selectedObject = null;
    this.render();
    this.addMessage('system', 'World reset to initial state.');
  }

  private addMessage(type: 'user' | 'system' | 'error', text: string): void {
    const event = new CustomEvent('shrdlu-message', {
      detail: { type, text }
    });
    window.dispatchEvent(event);
  }
}
