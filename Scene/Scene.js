// todo: builders object, builders.init, builders.render ...
	var axisIndicatorBuilder;
	function initAxisIndicator() 
	{
		axisIndicatorBuilder = new LineBuilder("Axis Indicator");
		
        axisIndicatorBuilder.AddSegment( [[0,0,0], [1,0,0]], [1,0,0,1] );
		axisIndicatorBuilder.AddSegment( [[0,0,0], [0,1,0]], [0,1,0,1] );
		axisIndicatorBuilder.AddSegment( [[0,0,0], [0,0,1]], [0,0,1,1] );
		
		axisIndicatorBuilder.Buffer(gl);
    }
	
    var postMeshBuilder;
	function initPostMesh() 
	{
		postMeshBuilder = new MeshBuilder("Post");
		
        postMeshBuilder.AddFencePost( [0,0,0], [1,3,1] );
		
		postMeshBuilder.Buffer(gl);
    }
	
	var gridBuilder;
	function initGrid()
	{
		gridBuilder = new LineBuilder("Grid");
		
		var sideLength = 10;
		for(var i= -1*sideLength; i<=sideLength; i++)
		{
			gridBuilder.AddSegment( [[i,0,-1*sideLength], [i,0,sideLength]], [.7,.7,.7,1] );
			gridBuilder.AddSegment( [[-1*sideLength,0,i], [sideLength,0,i]], [.7,.7,.7,1] );
		}	
		gridBuilder.Buffer(gl);		
	}
	
	function drawLineBuilder(lineBuilder) 
	{
		lineBuilder.Buffer(gl);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuilder.indexBuffer)
		
		gl.bindBuffer(gl.ARRAY_BUFFER, lineBuilder.vertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, lineBuilder.colourBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

		setMatrixUniforms();
		gl.lineWidth(1.0);
		gl.uniform4f(shaderProgram.colorUniform, 0, 0, 0, 1);
		gl.drawElements(gl.LINES, lineBuilder.numItems, gl.UNSIGNED_SHORT, 0);
		// todo unbind buffers?
	}
	
	function drawMeshBuilder(meshBuilder) 
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, meshBuilder.vertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, meshBuilder.colourBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLES, 0, meshBuilder.numItems);
	}