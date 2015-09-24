/**
SUMMARY
Simple undo manager to provide undo and redo actions in your Javascript application.

DOCUMENTATION
With each new/create action you call UndoManager.register(...) with these parameters:

param undoObj: caller of the undo function
param undoFunc: function to be called at myUndoManager.undo
param undoParamsList: (array) parameter list
param undoMsg: message to be used
redo params: you can figure these out...

So in an example create function would look like this:
function createPerson (name, id) {
	
	if (id == undefined) {
		// create id...
	}		
	// store name and id...
	
	this.undoManager.register(
		this, this.removePerson, [id], 'Remove person',
		this, this.createPerson, [name, id], 'Create person'
	);

}

To undo this action you write:

	myUndoManager.undo()

To redo this undo-ed action:

	myUndoManager.redo()
	
To clear the undo memory and lose all stored states:

	myUndoManager.clear()

Test if UndoManager has any undo actions:

	var hasUndo = myUndoManager.hasUndo()
	
Test if UndoManager has any redo actions:

	var hasRedo = myUndoManager.hasRedo()

To update your interface I recommend to use backbone.js that makes it easy to tie update functions to model updates.

A backbone version of the undo manager is also provided. Create an instance of UndoManager with:

	this.undoManager = new UndoManager()

	var onUndoChanged = function(undoManager) {
		$('.btnUndo').attr('disabled', !undoManager.hasUndo());
		$('.btnRedo').attr('disabled', !undoManager.hasRedo());
	};
	this.undoManager.bind('change', onUndoChanged);
If you don't use backbone.js, pass a function to setCallback:

	myUndoManager.setCallback(onUndoChanged)
LICENSE

The MIT License

Copyright (c) 2010-2012 Arthur Clemens, arthur@visiblearea.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
**/

var UndoManager = function () {
    // private
    var commandStack = [],
		index = -1,
		undoManagerContext = false,
		callback;

	function execute(command) {
		if (!command) {
			return;
		}
		undoManagerContext = true;
		command.f.apply(command.o, command.p);
		undoManagerContext = false;
	}

	function createCommand(undoObj, undoFunc, undoParamsList, undoMsg, redoObj, redoFunc, redoParamsList, redoMsg) {
		return {
			undo: {o: undoObj, f: undoFunc, p: undoParamsList, m: undoMsg},
			redo: {o: redoObj, f: redoFunc, p: redoParamsList, m: redoMsg}
		};
	}

    // public
    return {

		/*
		Registers an undo and redo command. Both commands are passed as parameters and turned into command objects.
		param undoObj: caller of the undo function
		param undoFunc: function to be called at myUndoManager.undo
		param undoParamsList: (array) parameter list
		param undoMsg: message to be used
		*/
		register: function (undoObj, undoFunc, undoParamsList, undoMsg, redoObj, redoFunc, redoParamsList, redoMsg) {
			if (undoManagerContext) {
				return;
			}
			
			// if we are here after having called undo,
			// invalidate items higher on the stack
			commandStack.splice(index + 1, commandStack.length - index);

			commandStack.push(createCommand(undoObj, undoFunc, undoParamsList, undoMsg, redoObj, redoFunc, redoParamsList, redoMsg));

			// set the current index to the end
			index = commandStack.length - 1;
			if (callback) {
				callback();
			}
		},

		/*
		Pass a function to be called on undo and redo actions.
		*/
		setCallback: function (callbackFunc) {
			callback = callbackFunc;
		},

		undo: function () {
			var command = commandStack[index];
			if (!command) {
				return;
			}
			execute(command.undo);
			index -= 1;
			if (callback) {
				callback();
			}
		},

		redo: function () {
			var command = commandStack[index + 1];
			if (!command) {
				return;
			}
			execute(command.redo);
			index += 1;
			if (callback) {
				callback();
			}
		},

		/*
		Clears the memory, losing all stored states.
		*/
		clear: function () {
			var prev_size = commandStack.length;

			commandStack = [];
			index = -1;

			if ( callback && ( prev_size > 0 ) ) {
				callback();
			}
		},

		hasUndo: function () {
			return index !== -1;
		},

		hasRedo: function () {
			return index < (commandStack.length - 1);
		}
	};
};

