function MeshBuilder(name)
{
	this.name = name;
	
	// properties for each vertex, beginning with position
    this.numItems = 0;
	this.vertices = [];
	this.colours = [];
	
	this.vertexBuffer;
	this.colourBuffer;
}

/***		AddPoly functions		***/
// idea: instead of addpoly functions for all the funny geometry of difference fence pieces,
// the fence object can only store the metadata used to generate the mesh, and it can have a meshbuilder
// "component" with the actual mesh in it. then it can buffer itself and stuff too.
// fence segment/post parameters (things to vary:)
/*
- scaleBottom
- scaleTop
- translate
- rotate (about the bottom.
- twist
- crossbarHeightsNormalized // ratios in [0,1] of how far up to place the crossbar joint

tricky things to solve:
- making fence joints meet (should make a comprehensive fence skeleton?)
- clipping detection/avoidance (normal calculation at a point on the fencepost?)
- pitching fence segments believably (spline work?)
- what about generating fences along a path, for a future enhancement?
*/

// Builds a post from the given parameters
// if the fence length is not divisible by segment length, the fence will stop early
// todo add vSegmentNumber, if one is set to -1 then use the other
// vScale is width, height, depth scaling of the fence lumber, but not change start or end
// vTilt is xTilt, yaw, zTilt // todo implement with the new gl lib?
MeshBuilder.prototype.AddFence = function(vStartLocation,vEndLocation,vSegmentLength) 
{

	// Declare builder brush vertices
	postVertices = ( 
			[ [0.0, 0.0, 0.0], 
			  [0.0, 1.0, 0.0],
			  [1.0, 1.0, 0.0], 			  
			  [1.0, 0.0, 0.0], 
			  [0.0, 0.0, 1.0], 
			  [0.0, 1.0, 1.0],
			  [1.0, 1.0, 1.0], 			  
			  [1.0, 0.0, 1.0]]);
		
	// Apply scale
	for (var i=0; i<=8; i++)
	{
		for (var j=0; j<=2; j++)
		{
			postVertices[i][j] *= vScale[j];
		}
	}
	
	// Apply location
	for (var i=0; i<8; i++)
	{
		for (var j=0; j<3; j++)
		{
			postVertices[i][j] += vLocation[j]
		}
	}
	
	this.AddRectPrism( postVertices );
}

// Builds a post from the given parameters
// vLocation is bottom left corner
// vScale is width, height, depth
// vTilt is xTilt, yaw, zTilt // todo implement with the new gl lib?
MeshBuilder.prototype.AddFencePost = function(vLocation,vScale) 
{
	// Declare builder brush vertices
	postVertices = ( 
			[ [0.0, 0.0, 0.0], 
			  [0.0, 1.0, 0.0],
			  [1.0, 1.0, 0.0], 			  
			  [1.0, 0.0, 0.0], 
			  [0.0, 0.0, 1.0], 
			  [0.0, 1.0, 1.0],
			  [1.0, 1.0, 1.0], 			  
			  [1.0, 0.0, 1.0]]);
		
	// Apply scale
	for (var i = 0; i < 8; i++){
		postVertices[i][0] *= vScale[0];
		postVertices[i][1] *= vScale[1];
		postVertices[i][2] *= vScale[2];
	}
	
	// Apply location
	for (var i = 0; i < 8; i++){
		postVertices[i][0] += vLocation[0];
		postVertices[i][1] += vLocation[1];
		postVertices[i][2] += vLocation[2];
	}
	
	this.AddRectPrism( postVertices );
}

// builds a rectangular prism from eight corners
// 		the front described clockwise from the front bottom left, 
//		followed by the back from the back bottom left
// vCoords[4]: array of four vector objects 
MeshBuilder.prototype.AddRectPrism = function(vCoords) 
{
	// +4 means its a back face coord, 0-3 run from bottom left counter clockwise
	this.AddQuad( [vCoords[0],   vCoords[1],   vCoords[2],   vCoords[3]] );   // front
	this.AddQuad( [vCoords[0+4], vCoords[1+4], vCoords[1],   vCoords[0]] );   // left
	this.AddQuad( [vCoords[3+4], vCoords[2+4], vCoords[1+4], vCoords[0+4]] ); // back
	this.AddQuad( [vCoords[3],   vCoords[2],   vCoords[2+4], vCoords[3+4]] ); // right
	this.AddQuad( [vCoords[1],   vCoords[1+4], vCoords[2+4], vCoords[2]] );   // top
	this.AddQuad( [vCoords[0+4], vCoords[1],   vCoords[3],   vCoords[3+4]] ); // bottom
}

// builds a quad from four corners, listen counter clockwise
// vCoords[4]: array of four vector objects (with the properties x, y, z)
MeshBuilder.prototype.AddQuad = function(vCoords) 
{
	this.AddTri( [vCoords[0], vCoords[1], vCoords[2]] );
	this.AddTri( [vCoords[0], vCoords[2], vCoords[3]] );
}

// builds a tri from three corners, listed counter clockwise
// vCoords[3]: array of three vector objects (with the properties x, y, z)
MeshBuilder.prototype.AddTri = function(vCoords) 
{
	// Build a quad from two triangles
	for (var i = 0; i < 3; i++)
		for (var j = 0; j < 3; j++)
		this.vertices = this.vertices.concat( vCoords[i][j] );
	
	this.numItems += 3;
	
	this.colours = this.colours.concat(
	  [1.0, 0.0, 0.0, 1.0,
	   0.0, 1.0, 0.0, 1.0,
	   0.0, 0.0, 1.0, 1.0]
	);
}

/***		End AddPoly functions		***/
/***		Rendering functions		***/

// gl: WebGL context
MeshBuilder.prototype.Buffer = function(gl) {
	// positions
	this.vertexBuffer = gl.initBuffer(gl.ARRAY_BUFFER, new Float32Array(this.vertices));	
	this.colourBuffer = gl.initBuffer(gl.ARRAY_BUFFER, new Float32Array(this.colours));    
}
/***	End Rendering functions		***/