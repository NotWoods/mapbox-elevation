# mapbox-elevation
A script to convert mapbox elevation tiles into grayscale heightmaps.  
[Demo clip](demo.mp4)
<video autoplay loop muted src="demo.mp4" width="480" height="270"></video>

Various tools like [Blender](https://www.blender.org/) support generating meshes
from grayscale heightmaps. Mapbox provides an API to access heightmaps, but
uses a different format to encode the heights in order to allow for higher 
resolution in the elevation values. 

When run with a local webserver, this program will take the file named
`heightmap.png` (from the Mapbox API) and create a grayscale version
using the Javascript Canvas API. The output in the Canvas can be saved
as a new image.

## See also
* [Mapbox - Access elevation data](https://www.mapbox.com/help/access-elevation-data)
