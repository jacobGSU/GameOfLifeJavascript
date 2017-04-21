function GameOfLife() {
    this.board = [];

    this.x = 30;
    this.y = 50;

    this.init();
}

GameOfLife.prototype.init = function() {
    this.gameControls();
    this.stop();
    this.board = this.makeBoard(this.x, this.y);
    this.generateCode(this.board);
    this.displayBoard(this.board);
};

GameOfLife.prototype.gameControls = function(){
    var that = this;

    $('#gameBoard').on('click', '.cell', function() {
        var idAttributes = $(this).attr('id').split('-');
        var x = idAttributes[1];
        var y = idAttributes[2];
        console.log(y);
        that.board[x][y] = !that.board[x][y];
        $(this).attr('on', that.board[x][y]);
        that.generateCode(that.board);
    });

    $('#nextGen').click(function() {
        that.nextGen();
    });

    $('#multiGen').click(function() {
        that.multiGen();
    });

    $('#play').click(function() {
        that.play();
    });

    $('#stop').click(function() {
        that.stop();
    });

    $('#reset').click(function() {
        that.reset();
    });

    $('#random').click(function() {
        that.random();
    });
};

GameOfLife.prototype.nextGen = function() {
    var newBoard = [];

    for (var i = 0; i < this.board.length; i+=1){
        var row = this.board[i];
        var newRow = [];

        for (var j = 0; j < row.length; j+=1){
            var cell = row[j];
            var livingNeighbors = 0;

            if (i > 0) {
                var previousRow = this.board[i-1];
                if (j > 0 && previousRow[j-1]) {
                    livingNeighbors += 1;
                }
                if (previousRow[j]){
                    livingNeighbors += 1;
                }
                if (j < row.length-1 && previousRow[j+1]){
                    livingNeighbors += 1;
                }
            }

            if (j > 0 && row[j-1]) {
                livingNeighbors += 1;
            }
            if (j < row.length-1 && row[j+1]){
                livingNeighbors += 1;
            }

            if (i < this.board.length-1) {
                var nextRow = this.board[i+1];
                if (j > 0 && nextRow[j-1]) {
                    livingNeighbors += 1;
                }
                if (nextRow[j]){
                    livingNeighbors += 1;
                }
                if (j < row.length-1 && nextRow[j+1]){
                    livingNeighbors += 1;
                }
            }

            if (livingNeighbors === 2) {
                newRow[j] = cell;
            } else if (livingNeighbors === 3){
                newRow[j] = true;
            } else {
                newRow[j] = false;
            }
        }

        newBoard[i] = newRow;
    }

    this.board = newBoard;
    this.displayBoard(this.board);
};

GameOfLife.prototype.multiGen = function() {
    var setCustomIncrement = 23;

    for (var i = 0; i < setCustomIncrement; i+=1){
        this.nextGen();
    }
};

GameOfLife.prototype.play = function() {
    if(!this.interval){
        $('#status').text('Playing').removeClass('stopped');
        var that = this;
        this.interval = setInterval(function(){
            that.nextGen();
        }, 50);
        console.log(this.interval);
    }
};

GameOfLife.prototype.stop = function() {
    if(this.interval) {
        $('#status').text('Stopped').addClass('stopped');
        clearInterval(this.interval);
        this.interval = undefined;
    }
};

GameOfLife.prototype.reset = function() {
    this.stop();
    this.board = this.makeBoard(this.x, this.y);
    this.displayBoard(this.board);
};

GameOfLife.prototype.random = function() {
    var setRandomSize = 30;
    this.stop();
    var percent = Math.random() + setRandomSize;
    this.board = this.makeRandomBoard(percent);
    this.displayBoard(this.board);
};

GameOfLife.prototype.makeRandomBoard = function(percent){
    percent = percent/100;
    var board =[];
    for (var i = 0; i < this.x ; i += 1) {
        board[i] = [];
        for (var j =0; j < this.y ; j += 1){
            if (Math.random() <= percent){
                board[i][j] = true;
            } else {
                board[i][j] = false;
            }
        }
    }
    return board;
};

GameOfLife.prototype.makeBoard = function(x, y){
    var board = [];
    for (var i = 0; i < x; i += 1){
        board[i] = [];
        for (var j = 0; j < y; j += 1){
            board[i][j] = false;
        }
    }
    return board;
};

GameOfLife.prototype.displayBoard = function(board){
    var html = '';

    for (var i = 0; i < this.x; i += 1){
        var row = board[i] || [];

        html += '<tr class="row" id= "row' + i + '">';

        for (var j = 0; j < this.y; j += 1){
            var cell = row[j] || 0;

            html += '<td class="cell" id="cell-'+i+'-'+j+'"'+(cell?' on="true"':'')+'></td>';
        }
        html += '</tr>';
    }
    $('#gameBoard').html(html);
    this.generateCode(this.board);
};

GameOfLife.prototype.decodeBoard = function(data) {
    var value = true;
    var board = [];
    var counter = 0;
    var row = 0;
    var that = this;

    data.split('').forEach(function(digit) {
        var radix = 36;
        var num = parseInt(digit, radix);
        for (var i = 0; i < num; i += 1){
            if (counter === 0){
                board[row] = [];
            }

            board[row][counter] = value;
            counter += 1;

            if (counter === that.y) {
                counter = 0;
                row += 1;
            }
        }
        value = value === false ? true : false;
    });

    return board;
};

GameOfLife.prototype.generateCode = function(board){
    var data = '';
    var run = 0;
    var value = true;

    for (var i in board) {
        var row = board[i];
        for (var j in row) {
            if (row[j] === value) {
                run += 1;

                if (run > 35) {
                    data += 'z0';
                    run = 1;
                }

            } else {
                data += run.toString(36);
                run = 1;
                value = value === true ? false : true;
            }
        }
    }
    data += run.toString(36);
};

$(document).ready(function(){
    var gameOfLife = new GameOfLife();
});