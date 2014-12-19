Grid2D
======

Javascript library to help manage two dimensional arrays.

Most useful features:
- Each cell in the grid holds a reference to the cell to the left/right/up/down
- Ability to call a function on a splice of the grid (a certain section)

Created to help with managing a Tilemap system in a 2d game

## Example

Small sample from a small (loopy) procedural world generator where it helped 
```
var grid = new Grid2D({w: 5, h: 5});
            
grid.each(function(cell) {
    var tileType = Math.floor(Math.random()*3);
    cell.set( tileType );
});

console.log("Map size", grid.size());

// Expand the grid to double the size and scale all cells
var new_grid = new Grid2D({w: grid.w*2, h: grid.h*2});
grid.each(function(cell, tileType) {
     new_grid.getCellAt(2 * cell.x, 2 * cell.y).set( tileType );
     new_grid.getCellAt(2 * cell.x + 1, 2 * cell.y).set( tileType );
     new_grid.getCellAt(2 * cell.x, 2 * cell.y + 1).set( tileType );
     new_grid.getCellAt(2 * cell.x + 1, 2 * cell.y + 1).set( tileType );
});
```

## Methods

```
// Run a callback on all cells
grid.each(function(cell, value) {});

// How many total cells there are in the grid
grid.size();

// Run a callback function on a portion of the grid
// @bounds {startx, starty, endx, endy}
// @callback function(cell, value)
grid.splice({
    startx: 0,
    starty: 0,
    endx: 10,
    endy: 4
}, function(cell, value) {});

// Get value from a cell at position
grid.getValueAt(x,y);

// Get an array of all values in the grid
grid.getAllValues();

// Get cell from a position
// @silent boolean set to True if you resonably expect a null response
// return Grid2DCell or null
grid.getCellAt(x, y, silent)

// Get cell by index
// return Grid2DCell
grid.getCellByIndex(i);
```