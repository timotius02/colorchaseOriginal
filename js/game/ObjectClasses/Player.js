Player = function() {
	Player.superclass.constructor.call(this);
	
	// Player settings
	this.mGroundHeight = 100;
	this.mHorizontalSpeed = 0;
	this.mVerticalSpeed = 0;
	this.mFallSpeed = 0;
	this.mBoostSpeed = 0;
	
	// Animation settings
	this.currentAnim = null;
	this.animArray = [];
	this.mStopped = false;
	
	// Boring stuff
	this.addEventListener("update", this.UpdatePosition.bind(this));
	this.useWorldPosition(true);
	return this;
}

Player.prototype = {


	setup : function(params) 
	{
    	this.mGame = params.gameScreen;
		Player.superclass.setup.call(this, params);
		this.SetupAnimations();
		return this;
	},
	
	SetupAnimations : function() 
	{
		
		// Running animation
		this.animArray["run"] = this.addChild(new TGE.SpriteSheetAnimation().setup({
			image : "player_running",
			rows : 1,
			columns : 4,
			totalFrames : 4,
			fps : 8,
			looping : true,
			visible : false,
			scale: .7
		}));
		
		// Flying animation
		this.animArray["fly"] = this.addChild(new TGE.SpriteSheetAnimation().setup({
	        image : "player_flying",
	        rows : 1,
	        columns : 4,
	        totalFrames : 4,
	        fps : 24,
	        looping : true,
	        visible : false,
	        scale: .7
		}));

		// Start player out running
		this.PlayAnimation("run");
	},
	
	
	UpdatePosition : function(event) 
	{
		
		if (this.mStopped) return;
	
	    // Add boost
	    if (this.mGame.mousedown) {
	        this.mVerticalSpeed = this.mBoostSpeed;
	        this.PlayAnimation("fly");
	    } 
	    
	    // Add gravity   
	    else {        
	        this.mVerticalSpeed += this.mFallSpeed;
			// Cap off the gravity at a certain point
	        if (this.mVerticalSpeed < this.mFallSpeed * 5) {
	            this.mVerticalSpeed = this.mFallSpeed * 5;
	        }
	    }
	    
	    // Update the position
	    var oldX = this.worldX;
		var newX = oldX;
		var newY = this.worldY;
	    newX += this.mHorizontalSpeed;
	    newY += this.mVerticalSpeed;
	
		// Constrain her within cieling and floor
	    var halfPlayerHeight = this.currentAnim.height / 2;
	    
	    // Ground
	    if (newY < this.mGroundHeight) 
	    {
			newY = this.mGroundHeight;
			this.mVerticalSpeed = 0;
			this.PlayAnimation("run");
	    } 
	    
	    // Cieling
	    else if (newY > this.mGame.height - halfPlayerHeight) 
	    {
	        newY = this.mGame.height - halfPlayerHeight;
			this.mVerticalSpeed = 0;
		}
		
		// Award the distance points
	    this.mGame.IncPlayerDistance(newX - oldX);
	
		// Assign the new position
		this.worldX = newX;
		this.worldY = newY;
	},


	PlayAnimation : function(name) 
	{
    
	    // If it's already started playing, don't start it again
	    if (this.currentAnim == this.animArray[name]) return;
		
		// Stop playing old animation if there is one
		if (this.currentAnim != null) {
			this.currentAnim.visible = false;
			this.currentAnim.gotoAndStop(0);
		}
		
		// Start playing next animation
		this.currentAnim = this.animArray[name];
		this.currentAnim.visible = true;
		this.currentAnim.gotoAndPlay(0);
	},


	SetSpeed : function(speed) {
		this.mHorizontalSpeed = speed * this.mGame.width;
	},
	
	SetFallSpeed : function(fallSpeed) {
		this.mFallSpeed = -fallSpeed * this.mGame.height;
	},
	
	SetBoostSpeed : function(boostSpeed) {
		this.mBoostSpeed = boostSpeed * this.mGame.height;
	},
	
	
}

extend(Player, TGE.SpriteSheetAnimation); 