MeshBuilder
===========

Simple WebGL modelling/procedural generation  suite. First stop: fences!

TODO:
- fence transformations:
	- scale
	- translate
	- rotate (about the bottom.
	- twist
	- crossbarHeightsNormalized // ratios in [0,1] of how far up to place the crossbar joints
	- topScale
- textbox with contents describing a json object that describes the fence to be built
- Build button that jquery parseJSON's the fence and builds it

object heirarchy:
fence
	
	posts[]
	crossbeams[]
	

post
	add