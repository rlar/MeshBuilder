var Input =
{ 
	bMouseDown : false,
	bMouseInWindow : false,
	bMouseFoundThisTick : false,
	mouseX : 0,
	mouseY : 0,
	deltaMouseX : 0,
	deltaMouseY : 0,
	lastMouseX : 0,
	lastMouseY : 0,
	keysDown : [],
	
	zoom : 0,
	rotate : 0,
	pan : 0,
	
	// binds mouse and keyboard input
	init : function()
	{
		var self = this;
		// jQuery fns
		// blur focus focusin focusout load resize scroll unload click dblclick
		// mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave 
		// change select submit keydown keypress keyup error contextmenu
		
		$("canvas")
			.mousedown(function() 
			{
				self.bMouseFoundThisTick = true;
				self.bMouseDown = true;
			})
			.mouseup(function()
			{
				self.bMouseDown = false;
			})
			.mouseout(function()
			{
				self.bMouseInWindow = false;
			})
			.mouseenter(function()
			{
				self.bMouseFoundThisTick = true;
				self.bMouseInWindow = true;
			})
			.mousemove(function( event ) 
			{
				self.mouseX = event.clientX;
				self.mouseY = event.clientY;		
			});
			
		$(document)
			.keydown(function( event )
			{
				self.keysDown = _.union(self.keysDown, [event.which]);
			})
			.keyup(function( event )
			{
				self.keysDown = _.without(self.keysDown, event.which);
			}
		);
	},
	
	tickMouse : function (deltaTime)
	{
	  	// deltaTime should be around 17ms, so normalize this around there
		this.deltaMouseX = (this.mouseX - this.lastMouseX) * 17.0 / deltaTime;
		this.deltaMouseY = (this.mouseY - this.lastMouseY) * 17.0 / deltaTime;
			
		// If mouse was just pressed then wait one tick before processing input
		if (this.bMouseFoundThisTick || !this.bMouseDown)
		{
			this.deltaMouseX = 0;
			this.deltaMouseY = 0;
			this.bMouseFoundThisTick = false;
		}
		
		this.lastMouseX = this.mouseX;
		this.lastMouseY = this.mouseY;
		
		this.rotate = (this.rotate + this.deltaMouseX) % 360;
		this.zoom += this.deltaMouseY * .05;
	},
	
	tickKeyboard : function (deltaTime)
	{
		var self = this;
		$.each(
			self.keysDown, 
			function(i, keyCode) 
			{
				var adjustment = .006 * deltaTime;
				
				switch(keyCode)
				{
					case 65: // a
						self.pan += adjustment;
						break;
					case 83: // s
						self.zoom -= adjustment;
						break;
					case 68: // d
						self.pan -= adjustment;
						break;
					case 81: // q
						self.rotate -= 10*adjustment;
						break;
					case 87: // w
						self.zoom += adjustment;
						break;
					case 69: // e
						self.rotate += 10*adjustment;
						break;
					default:
						break;
				}
			}
		);
	},
	
	tick : function (deltaTime)
	{
		this.tickMouse(deltaTime);
		this.tickKeyboard(deltaTime);
	}
}