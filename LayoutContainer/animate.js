(function($) {
	
	/*
	 *	A custom animation plugin that works with SWFs. Default jQuery animate functions
	 *	don't behave nicely in some browsers. In Firefox it causes the SWF to reload every
	 *	time you move the SWF, in Safari it was causing the video to freeze in the Publisher
	 *	and Subscriber widgets.
	 */	
	
	function NumericAnimator(that, fromValue, targetValue, duration) {
		if (duration == "fast") duration = 100;
		if (duration == "slow") duration = 500;
		var speed = 13;
		var interval;
		var step_amt;
		
		var currentValue = fromValue;

		this.getCurrentValue = function() {
			return currentValue;
		};
		
		this.setCurrentValue = function(value) {
			currentValue = value;
		};

		this.start = function() {
			var animator = this;
			interval = setInterval(function() {animator.step();}, speed);
		};

		this.step = function() {
			// Amount we change by at each step
			if (!step_amt)
				step_amt = (targetValue - this.getCurrentValue()) / (duration/speed);

			if (this.getCurrentValue() == targetValue) {
				this.stop();
				return;
			}

			if (step_amt > 0)
				this.setCurrentValue(this.getCurrentValue() + Math.min(Math.abs(step_amt), Math.abs(this.getCurrentValue() - targetValue)));
			else
				this.setCurrentValue(this.getCurrentValue() - Math.min(Math.abs(step_amt), Math.abs(this.getCurrentValue() - targetValue)));
		};

		this.stop = function() {
			clearInterval(interval);
		};
	}

	function Resizer (that, targetValue, duration, isWidth) {
		this.parentClass = NumericAnimator;
		this.parentClass(that, isWidth ? $(that).width() : $(that).height(), targetValue, duration);

		var superSetCurrentValue = this.setCurrentValue;
		this.setCurrentValue = function(value) {
			superSetCurrentValue(value);
			if (isWidth) {
				$(that).width(Math.round(value));
			} else {
				$(that).height(Math.round(value));
			}
		};
	}

	function Mover (that, targetValue, duration, cssKey) {
		this.parentClass = NumericAnimator;
		this.parentClass(that, $(that).position()[cssKey], targetValue, duration);

		var superSetCurrentValue = this.setCurrentValue;
		this.setCurrentValue = function(value) {
			superSetCurrentValue(value);
			$(that).css(cssKey, Math.round(value) + "px");
		};
	}

	/*
	 *	resizeSWF - animates a swf from it's current size to a new size.
	 *
	 *	width - The width to resize to
	 *	height - The height to resize to
	 *	duration - The duration the animation should take to execute in milliseconds
	 */
	$.fn.resizeSWF = function(width, height, duration) {
		
		this.each(function() {
			var widthResizer = new Resizer(this, width, duration, true);
			var heightResizer = new Resizer(this, height, duration, false);
			widthResizer.start();
			heightResizer.start();
		});
		
		return this;
	};
	
	/*
	 *	moveSWF - animates a swf from it's current position to a new position.
	 *
	 *	x - The x (left) position to move to
	 *	y - The y (top) position to move to
	 *	duration - The duration the animation should take to execute in milliseconds
	 */
	$.fn.moveSWF = function(x, y, duration) {
		
		this.each(function() {
			var xMover = new Mover(this, x, duration, "left");
			var yMover = new Mover(this, y, duration, "top");
			xMover.start();
			yMover.start();
		});
		
		return this;
	};
})(jQuery);