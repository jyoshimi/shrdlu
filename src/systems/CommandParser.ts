import { WorldManager } from './WorldManager';
import { BlockObject, ObjectType, ObjectColor, ObjectSize } from '../entities/BlockObject';

interface ParsedObject {
  type?: ObjectType;
  color?: ObjectColor;
  size?: ObjectSize;
}

export class CommandParser {
  private world: WorldManager;
  private lastReferencedObject: BlockObject | null = null;

  constructor(world: WorldManager) {
    this.world = world;
  }

  parse(command: string): string {
    const cmd = command.toLowerCase().trim();

    if (cmd === 'help' || cmd === 'commands') {
      return this.handleHelp();
    } else if (cmd.includes('put') || cmd.includes('place')) {
      return this.handlePut(cmd);
    } else if (cmd.includes('move')) {
      return this.handleMove(cmd);
    } else if (cmd.includes('stack')) {
      return this.handleStack(cmd);
    } else if (cmd.includes('what is on')) {
      return this.handleWhatIsOn(cmd);
    } else if (cmd.includes('how many')) {
      return this.handleHowMany(cmd);
    } else if (cmd.includes('what blocks')) {
      return this.handleWhatBlocks(cmd);
    } else if (cmd.includes('is') && cmd.includes('on')) {
      return this.handleIsOn(cmd);
    } else if (cmd.includes('what is the tallest')) {
      return this.handleTallest(cmd);
    } else if (cmd.includes('what') || cmd.includes('which')) {
      return this.handleGeneralQuery(cmd);
    }

    return "I don't understand that command. Type 'help' for examples or try 'move the large block to the table'.";
  }

  private handleHelp(): string {
    return `Available commands:
    
Movement:
  - move the small pyramid to the table
  - put the small block on the large pyramid
  - stack the small block on the large block
  
Queries:
  - what is on the table?
  - what is on the large block?
  - how many blocks are there?
  - how many pyramids are there?
  - is the small pyramid on the table?
  - what is the tallest block?
  
Type a command to interact with the blocks world.`;
  }

  private parseObject(text: string): ParsedObject {
    const obj: ParsedObject = {};

    if (text.includes('block')) obj.type = 'block';
    else if (text.includes('pyramid')) obj.type = 'pyramid';
    else if (text.includes('ball')) obj.type = 'ball';

    if (text.includes('red')) obj.color = 'red';
    else if (text.includes('green')) obj.color = 'green';
    else if (text.includes('blue')) obj.color = 'blue';
    else if (text.includes('yellow')) obj.color = 'yellow';

    if (text.includes('large') || text.includes('big')) obj.size = 'large';
    else if (text.includes('small') || text.includes('little')) obj.size = 'small';

    return obj;
  }

  private findObjectFromParsed(parsed: ParsedObject, context?: string): BlockObject | null {
    if (parsed.type === undefined && parsed.color === undefined && parsed.size === undefined) {
      if (context?.includes('it') && this.lastReferencedObject) {
        return this.lastReferencedObject;
      }
      return null;
    }

    const found = this.world.findObject(parsed.type, parsed.color, parsed.size);
    if (found) {
      this.lastReferencedObject = found;
      return found;
    }

    const matches = this.world.findObjects(parsed.type, parsed.color, parsed.size);
    if (matches.length === 0) {
      return null;
    } else if (matches.length > 1) {
      return null;
    }
    
    this.lastReferencedObject = matches[0];
    return matches[0];
  }

  private handlePut(cmd: string): string {
    const parts = cmd.split(/\s+on\s+|\s+onto\s+/);
    if (parts.length < 2) {
      return "I need to know what to put and where to put it.";
    }

    const objParsed = this.parseObject(parts[0]);
    const targetParsed = this.parseObject(parts[1]);

    const obj = this.findObjectFromParsed(objParsed, parts[0]);
    if (!obj) {
      return "I don't see the object you want to move.";
    }

    let target: BlockObject | null = null;
    if (parts[1].includes('table')) {
      target = null;
    } else {
      target = this.findObjectFromParsed(targetParsed, parts[1]);
      if (!target) {
        return "I don't see the target object.";
      }
    }

    if (target && !this.world.canPlace(obj, target)) {
      if (target.type === 'pyramid') {
        return `I can't put anything on a pyramid.`;
      } else if (target.type === 'ball') {
        return `I can't put anything on a ball.`;
      } else {
        return `The ${target.describe()} is too small to support the ${obj.describe()}.`;
      }
    }

    this.world.moveObject(obj, target);
    
    if (target) {
      return `OK. I put the ${obj.describe()} on the ${target.describe()}.`;
    } else {
      return `OK. I put the ${obj.describe()} on the table.`;
    }
  }

  private handleMove(cmd: string): string {
    return this.handlePut(cmd.replace('move', 'put'));
  }

  private handleStack(cmd: string): string {
    return this.handlePut(cmd.replace('stack', 'put'));
  }

  private handleWhatIsOn(cmd: string): string {
    if (cmd.includes('table')) {
      const objectsOnTable = this.world.objects.filter(obj => obj.isOnTable());
      if (objectsOnTable.length === 0) {
        return "Nothing is on the table.";
      } else if (objectsOnTable.length === 1) {
        return `The ${objectsOnTable[0].describe()} is on the table.`;
      } else {
        const descriptions = objectsOnTable.map(o => o.describe()).join(', ');
        return `There are ${objectsOnTable.length} objects on the table: ${descriptions}.`;
      }
    }

    const parsed = this.parseObject(cmd);
    const obj = this.findObjectFromParsed(parsed, cmd);

    if (!obj) {
      return "I don't see that object.";
    }

    const objectsOn = this.world.getObjectsOn(obj);
    if (objectsOn.length === 0) {
      return `Nothing is on the ${obj.describe()}.`;
    } else if (objectsOn.length === 1) {
      return `The ${objectsOn[0].describe()} is on the ${obj.describe()}.`;
    } else {
      const descriptions = objectsOn.map(o => o.describe()).join(', ');
      return `There are ${objectsOn.length} objects on the ${obj.describe()}: ${descriptions}.`;
    }
  }


  private handleHowMany(cmd: string): string {
    const parsed = this.parseObject(cmd);
    const count = this.world.countObjects(parsed.type, parsed.color, parsed.size);

    if (count === 0) {
      return "There are no objects matching that description.";
    } else if (count === 1) {
      return "There is 1 object matching that description.";
    } else {
      return `There are ${count} objects matching that description.`;
    }
  }

  private handleWhatBlocks(cmd: string): string {
    const parsed = this.parseObject(cmd);
    const objects = this.world.findObjects(parsed.type, parsed.color, parsed.size);

    if (objects.length === 0) {
      return "There are no objects matching that description.";
    } else if (objects.length === 1) {
      return `There is the ${objects[0].describe()}.`;
    } else {
      const descriptions = objects.map(o => o.describe()).join(', ');
      return `There are ${objects.length} objects: ${descriptions}.`;
    }
  }

  private handleIsOn(cmd: string): string {
    const parts = cmd.split(/\s+on\s+/);
    if (parts.length < 2) {
      return "I need to know what object and what surface.";
    }

    const objParsed = this.parseObject(parts[0]);
    const obj = this.findObjectFromParsed(objParsed, parts[0]);

    if (!obj) {
      return "I don't see that object.";
    }

    if (parts[1].includes('table')) {
      if (obj.isOnTable()) {
        return `Yes, the ${obj.describe()} is on the table.`;
      } else {
        return `No, the ${obj.describe()} is not on the table. It is on the ${obj.supportedBy!.describe()}.`;
      }
    }

    const targetParsed = this.parseObject(parts[1]);
    const target = this.findObjectFromParsed(targetParsed, parts[1]);

    if (!target) {
      return "I don't see the target object.";
    }

    if (obj.supportedBy === target) {
      return `Yes, the ${obj.describe()} is on the ${target.describe()}.`;
    } else {
      return `No, the ${obj.describe()} is not on the ${target.describe()}.`;
    }
  }

  private handleTallest(_cmd: string): string {
    const tallest = this.world.getTallestObject();
    if (!tallest) {
      return "There are no objects in the world.";
    }
    return `The tallest object is the ${tallest.describe()}.`;
  }

  private handleGeneralQuery(_cmd: string): string {
    return "I understand you're asking a question, but I'm not sure what you want to know. Try being more specific.";
  }
}
