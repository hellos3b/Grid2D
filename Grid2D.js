// Grid2D
// An easy way to manage 2 dimensional arrays

// made by hellos3b@github on a "as I need it basis" while developing a tiled game
// decided to github it in case somebody else finds it useful

// https://github.com/hellos3b/Grid2D



// Exporter for AMD & node
(function(e,t){if(typeof define==="function"&&define.amd){define([],t)}else if(typeof exports==="object"){module.exports=t()}else{e.returnExports=t()}})(this,function(){
    
    // Cell item in a grid
    // Holds a data object, x y position in grid, and reference to neighbors
    function Grid2DCell(args) {
        this.parent = args.parent;          // Grid2D 
        this.x = args.x;                    // x position (1,1) scale
        this.y = args.y;                    // y position
        this.value = args.value || null;    // basically whatever value/object the cell holds (optional on init)
        
        // Reference to neighboring cells
        this.neighbors = {
            "top": null,
            "right": null,
            "bottom": null,
            "left": null
        };
        
        // Get cell value
        this.get = function() {
            return this.value;
        };
        
        // Set cell value
        // @value any value you wish the cell to hold
        this.set = function(value) {
            this.value = value;
        };
        
        // Set a neighbor reference
        // @direction String "top" "right" "bottom" "left"
        // @cell Grid2DCell reference
        this.setNeighbor = function(direction, cell) {
            this.neighbors[direction] = cell;
        };
        
        // Get all neighbors
        // return object
        this.getNeighbors = function() {
            return this.neighbors;
        };
        
        // Get single neighbor
        // @direction String "top" "right" "bottom" "left"
        this.getNeighbor = function(direction) {
            try {
                return this.neighbors[direction];
            } catch (e) {
                console.warn("[Grid2D] Neighbor "+direction+" doesn't exist", this.neighbors);
                return null;
            }
        };
        
        // Automatically set the neighbors from parent
        this.findNeighbors = function() {
            var parent = this.parent;
            var x = this.x;
            var y = this.y;
            this.setNeighbor("up", parent.getCellAt(x, y-1, true));
            this.setNeighbor("right", parent.getCellAt(x+1, y, true));
            this.setNeighbor("down", parent.getCellAt(x-1, y, true));
            this.setNeighbor("bottom", parent.getCellAt(x, y+1, true));
        };
        
        // Call a function on the object
        // @callback function one argument, cell value
        this.call = function(callback) {
            callback(this.value);
        };
    }
    
    
    // Grid2D constructor
    // @args (Array || {w: 1, h: 1} set from previous data or initialize a size
    function Grid2D(args) {
        this.cells = [];     // 2D Array of cells
        this.cellsFlat = []; // 1D Array
        this.cellsMap = {};  // Index-based of cell
        
        // it can be initialized via size or from a previous 2D array
        if (args instanceof Array) {
            this.initData(args);
        } else {
            this.initSize(args);
        }
    }
    
    Grid2D.prototype = {
        
        // Initiliaze grid with an array
        initData: function(data) {
            var self = this;
            
            // 2d array has to be the same size
            this.w = data[0].length;
            this.h = data.length;
            
            for (var y = 0; y < this.h; y++) {
                var row = [];
                for (var x = 0; x < this.w; x++) {
                    // Create cell item with previous data
                    var cell = new Grid2DCell({
                        parent: self,
                        x: x,
                        y: y,
                        value: data[y][x]
                    });
                    
                    this.cellsFlat.push(cell);
                    row.push(cell);
                }
                this.cells.push(row);
            }

            // Have to wait till all the cells are initialized to find neighbors
            this.each(function(cell) {
                cell.findNeighbors();
            });
        },
        
        // Initiliaze empty grid with size
        initSize: function(size) {
            var self = this;
            
            this.w = size.w;
            this.h = size.h;
            
            for (var y = 0; y < size.h; y++) {
                var row = [];
                for (var x = 0; x < size.w; x++) {
                    var cell = new Grid2DCell({
                        parent: self,
                        x: x,
                        y: y
                    });
                    this.cellsFlat.push(cell);
                    row.push(cell);
                }
                this.cells.push(row);
            }
            
            // Have to wait till all the cells are initialized to find neighbors
            this.each(function(cell) {
                cell.findNeighbors();
            });
        },
        
        // Run a function on all cells
        // @callback function(cell, value)
        each: function(callback) {
            this.splice({
                startx: 0,
                starty: 0,
                endy: this.h - 1,
                endx: this.w - 1
            }, callback);
        },
        
        // How many cells there are in the grid
        size: function() {
            return this.cellsFlat.length;
        },
        
        // Run a callback function on a portion of the grid
        // @bounds {startx, starty, endx, endy}
        // @callback function(cell, value)
        splice: function(bounds, callback) {
            // keep it in bounds
            bounds.starty = (bounds.starty < 0) ? 0 : bounds.starty;
            bounds.starty = (bounds.starty > this.h) ? this.h - 1: bounds.starty;
            bounds.endy = (bounds.endy < 0) ? 0 : bounds.endy;
            bounds.endy = (bounds.endy > this.h) ? this.h - 1: bounds.endy;
            bounds.startx = (bounds.startx < 0) ? 0 : bounds.startx;
            bounds.startx = (bounds.startx > this.w) ? this.w - 1: bounds.startx;
            bounds.endx = (bounds.endx < 0) ? 0 : bounds.endx;
            bounds.endx = (bounds.endx > this.w) ? this.w - 1 : bounds.endx;

              for (var y = bounds.starty; y <= bounds.endy; y++) {
                for (var x = bounds.startx; x <= bounds.endx; x++) {
                    var cell = this.getCellAt(x,y);
                    callback(cell, cell.get());
                } 
              }
        },
        
        // Get value from a cell at position
        getValueAt: function(x, y) {
            return this.getCellAt(x, y).get();  
        },
        
        // Get an array of all values in the grid
        // return Array
        getAllValues: function() {
            return this.cellsFlat.map(function(cell) { return cell.get(); });
        },
        
        // Get cell from a position
        // @silent boolean set to True if you resonably expect a null response
        // return Grid2DCell or null
        getCellAt: function(x, y, silent) {
            try {
                return this.cells[y][x];
            } catch (e) {
                if (!silent)
                    console.warn("[Grid2D] Could not find cell at ("+x+","+y+")", this);

                return null;   
            }
        },
        
        // Get cell by index
        // return Grid2DCell
        getCellByIndex: function(i) {
            return this.cellsFlat[i];
        }
        
    };

    return Grid2D;
});