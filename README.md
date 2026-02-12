# SHRDLU - Blocks World Natural Language Interface

A web-based reimplementation of Terry Winograd's classic SHRDLU natural language understanding system, built with Phaser 3 and TypeScript.

## About SHRDLU

SHRDLU was created by Terry Winograd at MIT in 1968-1970 as one of the first natural language understanding programs. It allows users to manipulate objects in a simulated "blocks world" using English commands. This implementation captures the spirit of the original while providing a modern, interactive 3D visualization.

## Features

- **Natural Language Commands**: Interact with blocks using English sentences
- **3D Visualization**: Pseudo-3D rendering of blocks, pyramids, and balls
- **Interactive Camera**: Rotate view by dragging, zoom with mouse wheel
- **Context Awareness**: System remembers previously referenced objects
- **Query System**: Ask questions about the world state

## Tech Stack

- **Engine**: Phaser 3 (v3.80.1)
- **Language**: TypeScript (strict mode)
- **Bundler**: Vite (v5.0.12)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (opens at localhost:3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Example Commands

### Movement Commands
- `pick up the red block`
- `put the green pyramid on the blue block`
- `move the large red block to the table`
- `stack the small blue block on the red pyramid`
- `grasp the pyramid`

### Query Commands
- `what is on the red block?`
- `what color is the pyramid?`
- `is the blue block on the table?`
- `what is the tallest block?`
- `how many blocks are there?`
- `what blocks are red?`

## Object Types

- **Blocks**: Cubic objects that can be stacked
- **Pyramids**: Triangular objects (cannot support other objects)
- **Balls**: Spherical objects (cannot be stacked)

## Properties

- **Colors**: red, green, blue, yellow
- **Sizes**: small, large

## Controls

- **Mouse Drag**: Rotate camera view
- **Mouse Wheel**: Zoom in/out
- **Click Object**: Select and highlight (future feature)

## Project Structure

```
src/
├── main.ts                    # Entry point and UI setup
├── scenes/
│   └── WorldScene.ts          # Main Phaser scene with 3D rendering
├── entities/
│   └── BlockObject.ts         # Block object class and types
└── systems/
    ├── WorldManager.ts        # World state management
    └── CommandParser.ts       # Natural language parser
```

## Implementation Notes

This is a simplified reimplementation that captures the core concepts of SHRDLU:

1. **Natural Language Understanding**: The parser recognizes common sentence patterns and extracts objects, actions, and targets
2. **World Simulation**: Objects have physical properties and relationships (supporting/supported by)
3. **Context Memory**: The system tracks recently referenced objects for pronoun resolution
4. **Constraint Checking**: Physics rules prevent impossible actions (e.g., stacking on pyramids)

Unlike the original SHRDLU (written in Lisp/Micro Planner), this version uses a simpler pattern-matching approach rather than full linguistic analysis. It's designed to be educational and demonstrate the core concepts.

## Limitations

- Simplified natural language parsing (pattern matching vs. full NLP)
- Limited vocabulary compared to original
- No learning or planning capabilities
- No "why" questions about past actions

## Future Enhancements

- More sophisticated NLP using modern techniques
- Additional object types and properties
- Action history and explanation system
- Voice input support
- More complex spatial reasoning

## Credits

Original SHRDLU by Terry Winograd (MIT, 1968-1970)
Web implementation by [Your Name]

## License

MIT License
