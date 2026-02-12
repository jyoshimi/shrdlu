# SHRDLU Quick Start Guide

## Installation & Running

```bash
cd shrdlu
npm install
npm run dev
```

The application will open at `http://localhost:3001`

## First Commands to Try

Once the app loads, try these commands in order:

1. **Basic pickup:**
   ```
   pick up the red pyramid
   ```

2. **Place on another object:**
   ```
   put it on the yellow block
   ```

3. **Query what's on an object:**
   ```
   what is on the blue block?
   ```

4. **Move to table:**
   ```
   move the red pyramid to the table
   ```

5. **Ask about colors:**
   ```
   what color is the large block?
   ```

6. **Count objects:**
   ```
   how many blocks are there?
   ```

7. **Check tallest:**
   ```
   what is the tallest block?
   ```

8. **Ask yes/no questions:**
   ```
   is the green block on the table?
   ```

## Tips

- Use the mouse to **drag and rotate** the camera view
- Use the **scroll wheel** to zoom in/out
- The system remembers the last object you mentioned (you can use "it")
- Be specific with colors and sizes when there are multiple similar objects
- Click "Reset World" to return to the initial state
- Click "Show Help" for more command examples

## Understanding the Interface

- **Left side**: Command input and conversation history
- **Right side**: 3D visualization of the blocks world
- **Green text**: Your commands
- **Blue text**: System responses

## Common Issues

**"I don't understand which [object] you mean"**
- There are multiple objects matching your description
- Add more details (color, size) to be more specific

**"I can't put anything on a pyramid"**
- Pyramids have pointed tops and can't support other objects
- Try placing on a block instead

**"The [object] is too small to support the [other object]"**
- Small objects can't support large objects
- Stack large objects first, then small ones on top

## Example Session

```
> pick up the small red pyramid
OK. I picked up the small red pyramid.

> put it on the large blue block
OK. I put the small red pyramid on the large blue block.

> what is on the blue block?
The small red pyramid is on the large blue block.

> how many pyramids are there?
There are 2 objects matching that description.

> move the green pyramid to the table
OK. I put the large green pyramid on the table.
```

## Next Steps

- Experiment with different command phrasings
- Try stacking multiple objects
- Ask various questions about the world state
- Use the camera controls to view from different angles

Enjoy exploring the SHRDLU blocks world!
