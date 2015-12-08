Demo for responsive site loading products from a json feed into a grid.

No use of frameworks - pure javascript and css.

Notes:

 * The template did not give information about how to display for mobile, other than an instruction to render for mobile as well.
   I have simply collapsed the columns into a 4 column, 2 column and single column approach based on the viewport width.

 * One interesting point is the order of display of items. On a desktop it may be ideal to display the phones the company wants to push accross the top of the columns, however on a mobile it may be preferable to display down each column as the ordering of products will be quite different. Various approaches could be taken to solive this, including reading the screen size at load time and loading phones in order accross the columns for wider screen widths, and down for smaller at that point. I think this was perhaps a little more than is required at the moment, but I thoght I'd note it as important for a production environment. 

* For highlighting a selected phone, the browser will scroll if it is not in the viewport, otherwise it will simply be highlighted.

* I would also push for a cleaner api - either without sections, or with sections but the data grouped under these rather than having different items in one stream - it is hard to know at a glance what to do with it or how many phones there are by simply checking the length the way it is at present.
