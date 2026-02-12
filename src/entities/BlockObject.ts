export type ObjectType = 'block' | 'pyramid' | 'ball';
export type ObjectColor = 'red' | 'green' | 'blue' | 'yellow';
export type ObjectSize = 'small' | 'large';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export class BlockObject {
  id: string;
  type: ObjectType;
  color: ObjectColor;
  size: ObjectSize;
  position: Position3D;
  supportedBy: BlockObject | null = null;
  supporting: BlockObject[] = [];
  sprite: Phaser.GameObjects.Sprite | null = null;

  constructor(
    id: string,
    type: ObjectType,
    color: ObjectColor,
    size: ObjectSize,
    position: Position3D
  ) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.size = size;
    this.position = { ...position };
  }

  get width(): number {
    if (this.type === 'block') {
      return this.size === 'large' ? 80 : 50;
    } else if (this.type === 'pyramid') {
      return this.size === 'large' ? 70 : 45;
    } else {
      return this.size === 'large' ? 60 : 40;
    }
  }

  get height(): number {
    if (this.type === 'block') {
      return this.size === 'large' ? 80 : 50;
    } else if (this.type === 'pyramid') {
      return this.size === 'large' ? 90 : 60;
    } else {
      return this.size === 'large' ? 60 : 40;
    }
  }

  get depth(): number {
    return this.width;
  }

  canSupport(other: BlockObject): boolean {
    if (this.type === 'pyramid' || this.type === 'ball') {
      return false;
    }
    if (other.type === 'ball') {
      return false;
    }
    return this.width >= other.width * 0.8;
  }

  isOnTable(): boolean {
    return this.supportedBy === null;
  }

  getTopPosition(): number {
    return this.position.z + this.height;
  }

  describe(): string {
    const sizeStr = this.size;
    const typeStr = this.type;
    return `${sizeStr} ${typeStr}`;
  }

  matches(type?: ObjectType, color?: ObjectColor, size?: ObjectSize): boolean {
    if (type && this.type !== type) return false;
    if (color && this.color !== color) return false;
    if (size && this.size !== size) return false;
    return true;
  }
}
