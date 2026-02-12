# SHRDLU Implementation Summary

## Overview

This is a web-based reimplementation of Terry Winograd's classic SHRDLU natural language understanding system. The application allows users to interact with a 3D blocks world using natural English commands.

## Architecture

### Core Components

1. **BlockObject** (`src/entities/BlockObject.ts`)
   - Represents objects in the world (blocks, pyramids, balls)
   - Properties: type, color, size, position
   - Tracks support relationships (what's on top, what's underneath)
   - Provides physical constraint checking

2. **WorldManager** (`src/systems/WorldManager.ts`)
   - Manages all objects in the world
   - Handles object placement and movement
   - Provides query methods for finding objects
   - Maintains world state

3. **CommandParser** (`src/systems/CommandParser.ts`)
   - Parses natural language commands
   - Extracts objects, actions, and targets from text
   - Implements context memory for pronoun resolution
   - Generates natural language responses

4. **WorldScene** (`src/scenes/WorldScene.ts`)
   - Phaser scene that renders the 3D world
   - Implements pseudo-3D projection
   - Handles camera rotation and zoom
   - Coordinates between parser and renderer

5. **Main** (`src/main.ts`)
   - Entry point and UI setup
   - Manages conversation display
   - Handles user input
   - Connects UI to game scene

## Features Implemented

### Natural Language Commands

**Movement Commands:**
- `pick up the red block`
- `put the green pyramid on the blue block`
- `move the large red block to the table`
- `stack the small blue block on the red pyramid`

**Query Commands:**
- `what is on the red block?`
- `what color is the pyramid?`
- `is the blue block on the table?`
- `what is the tallest block?`
- `how many blocks are there?`

### 3D Visualization

- Pseudo-3D rendering using 2D graphics
- Isometric-style projection
- Proper depth sorting for occlusion
- Different rendering for blocks, pyramids, and balls
- Color-coded objects (red, green, blue, yellow)

### Interactive Controls

- **Mouse drag**: Rotate camera around the world
- **Mouse wheel**: Zoom in/out
- **Text input**: Natural language commands

### Physics Constraints

- Pyramids and balls cannot support other objects
- Objects must fit on their support surface
- Stacking relationships are maintained
- Table is the base surface

## Initial World State

The world starts with:
- 1 large red block (on table)
- 1 large blue block (on table, supporting red pyramid)
- 1 small green block (on table)
- 1 small red pyramid (on blue block)
- 1 large green pyramid (on table)
- 1 small yellow block (on table)

## Command Parsing Strategy

The parser uses pattern matching to identify:

1. **Action verbs**: pick up, put, move, stack, grasp
2. **Query words**: what, how many, is, which
3. **Object properties**: color (red/green/blue/yellow), size (small/large), type (block/pyramid/ball)
4. **Spatial relations**: on, on top of

The parser extracts these elements and constructs appropriate actions or queries.

## Limitations

This is a simplified implementation compared to the original SHRDLU:

1. **No full NLP**: Uses pattern matching instead of linguistic analysis
2. **Limited vocabulary**: Subset of commands compared to original
3. **No planning**: Cannot break complex goals into steps
4. **No "why" questions**: Cannot explain reasoning about past actions
5. **Simple context**: Only tracks last referenced object

## Running the Application

```bash
# Development mode
cd shrdlu
npm install
npm run dev

# Production build
npm run build
npm run preview
```

The dev server runs on `http://localhost:3001`

## Technical Stack

- **Phaser 3.80.1**: Game engine for rendering
- **TypeScript 5.3.3**: Type-safe development
- **Vite 5.0.12**: Fast build tool and dev server

## Future Enhancements

Possible improvements:
- More sophisticated NLP using modern techniques
- Action history and explanation system ("why did you do that?")
- More object types and properties
- Voice input support
- Better spatial reasoning (left/right, behind/in front)
- Learning new concepts and definitions
- Multi-step planning for complex goals

## Credits

- Original SHRDLU: Terry Winograd (MIT, 1968-1970)
- Web implementation: Based on cancerBossPrototype architecture
