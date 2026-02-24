import { BlockObject, ObjectType, ObjectColor, ObjectSize } from '../entities/BlockObject';

export class WorldManager {
  objects: BlockObject[] = [];
  tableWidth = 600;
  tableDepth = 600;

  constructor() {
    this.initializeWorld();
  }

  private initializeWorld(): void {
    this.objects = [
      new BlockObject('obj1', 'block', 'red', 'large', { x: -150, y: -100, z: 0 }),
      new BlockObject('obj2', 'block', 'blue', 'small', { x: -20, y: 70, z: 0 }),
      new BlockObject('obj3', 'pyramid', 'green', 'small', { x: -150, y: -100, z: 80 }),
      new BlockObject('obj4', 'pyramid', 'yellow', 'large', { x: 120, y: -30, z: 0 }),
      new BlockObject('obj5', 'ball', 'red', 'small', { x: 40, y: 120, z: 0 }),
      new BlockObject('obj6', 'ball', 'blue', 'large', { x: 180, y: 90, z: 0 }),
    ];

    this.objects[2].supportedBy = this.objects[0];
    this.objects[0].supporting.push(this.objects[2]);
  }

  reset(): void {
    this.objects = [];
    this.initializeWorld();
  }

  findObject(type?: ObjectType, color?: ObjectColor, size?: ObjectSize): BlockObject | null {
    const matches = this.objects.filter(obj => obj.matches(type, color, size));
    if (matches.length === 1) {
      return matches[0];
    }
    return null;
  }

  findObjects(type?: ObjectType, color?: ObjectColor, size?: ObjectSize): BlockObject[] {
    return this.objects.filter(obj => obj.matches(type, color, size));
  }

  canPlace(obj: BlockObject, target: BlockObject | null): boolean {
    if (target === null) {
      return true;
    }
    return target.canSupport(obj);
  }

  moveObject(obj: BlockObject, target: BlockObject | null): boolean {
    if (!this.canPlace(obj, target)) {
      return false;
    }

    if (obj.supportedBy) {
      obj.supportedBy.supporting = obj.supportedBy.supporting.filter(o => o !== obj);
    }

    for (const supported of obj.supporting) {
      supported.supportedBy = null;
      supported.position.z = 0;
    }
    obj.supporting = [];

    if (target === null) {
      obj.position.z = 0;
      obj.supportedBy = null;
    } else {
      obj.position.x = target.position.x;
      obj.position.y = target.position.y;
      obj.position.z = target.getTopPosition();
      obj.supportedBy = target;
      target.supporting.push(obj);
    }

    return true;
  }

  getObjectsOn(target: BlockObject): BlockObject[] {
    return target.supporting;
  }

  getObjectsOfType(type: ObjectType): BlockObject[] {
    return this.objects.filter(obj => obj.type === type);
  }

  getObjectsOfColor(color: ObjectColor): BlockObject[] {
    return this.objects.filter(obj => obj.color === color);
  }

  getTallestObject(): BlockObject | null {
    if (this.objects.length === 0) return null;
    return this.objects.reduce((tallest, obj) => 
      obj.getTopPosition() > tallest.getTopPosition() ? obj : tallest
    );
  }

  countObjects(type?: ObjectType, color?: ObjectColor, size?: ObjectSize): number {
    return this.findObjects(type, color, size).length;
  }

  isOnTable(obj: BlockObject): boolean {
    return obj.isOnTable();
  }

  getSupport(obj: BlockObject): BlockObject | null {
    return obj.supportedBy;
  }
}
