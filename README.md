# Sigma.js Drop-in tool
Shared under GNU-license,
developed at the KULeuven for DARIAH-BE

**NOTICE**: draft version

## Table of content
// will be made after the draft has been okayed.

## Introduction
### Dependencies
This tool is powered by the **sigma.js** library, as such it will require the sigma.js files. All relevant files need to be linked in the <code>head</code> section of your HTML-page.

There's also a need for **jQuery**
### Intended use
This tool is developed to be used as an alternative to gephi-files. It specifically targets websites that work with continuously growing databases and don't want to spend time on recreating a gephi-graph after each database-update.

Data can be fed to the applet by PHP or HTML. 

### Implementation


1.  Download the necessary sigma.js files.
  - Go to the sigma.js [GitHub page](https://github.com/jacomyal/sigma.js/ "GitHub page").
  - Download the library.
  - Copy the following folders to your own project folder:
	  - plugins/sigma.layout.forceAtlas2
	  - plugins/sigma.renderers.edgeLabels
	  - plugins/sigma.renderers.edgeLabels
	  - plugins/sigma.plugins.dragNodes
	  - plugins/sigma.plugins.relativeSize
	  - plugins/sigma.layout.noverlap
	  - plugins/sigma.exporters.svg
	  - plugins/sigma.renderers.snapshot
	  - plugins/sigma.plugins.filter
	  - src/renderers/canvas
	  - src/middlewares

2. Download FruchtermanReingold from linkurious. 
  - Go to the linkurious.js [GitHub page](https://github.com/Linkurious/linkurious.js "GitHub page")
  - Download the library
  - Copy the following folder to your own project folder:
	  - plugins/sigma.layouts.fruchtermanReingold

3. Create your HTML or PHP document
  - In the <code>head</code> section you'll need to link all dependencies.

```HTML

	<script src="plugins/sigma.layout.forceAtlas2/worker.js"></script>
    <script src="plugins/sigma.layout.forceAtlas2/supervisor.js"></script>
    <script src="plugins/sigma.renderers.edgeLabels/settings.js"></script>
    <script src="plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.curve.js"></script>
    <script src="plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.def.js"></script>
    <script src="plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.curvedArrow.js"></script>
    <script src="plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes.js"></script>
    <script src="plugins/sigma.plugins.relativeSize/sigma.plugins.relativeSize.js"></script>
    <script src="plugins/sigma.layout.noverlap/sigma.layout.noverlap.js"></script>
    <script src="src/renderers/canvas/sigma.canvas.nodes.def.js"></script>
    <script src="plugins/sigma.exporters.svg/sigma.exporters.svg.js"></script>
    <script src="plugins/sigma.renderers.snapshot/sigma.renderers.snapshot.js"></script>
    <script src="plugins/sigma.layouts.fruchtermanReingold/sigma.layout.fruchtermanReingold.js"></script>
    <script src="plugins/sigma.plugins.filter/sigma.plugins.filter.js"></script>
    <script src="src/middlewares/sigma.middlewares.rescale.js"></script>

	<!-- JQUERY-->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<!-- JSOC -->
	  <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery.jssocials/1.4.0/jssocials.min.js"></script>
	  <link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/jquery.jssocials/1.4.0/jssocials.css" />
	  <link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/jquery.jssocials/1.4.0/jssocials-theme-flat.css" >
	
	<!-- custom dariah script -->
	  <script type="text/javascript" src="vis.js"></script>
	
	<!-- custom styling -->
	<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css">
	<link rel="stylesheet" href="style.css">


```

You can now close the <code>head</code> tag

4. Prepare the <code>body</code> tag. 
  - Create a div with the id "blackboard"
	  - ``` <div id="blackboard"></div>```

  - Open a <code>script</code> tag and call the function with two arguments.
	  - The first argument is a JavaScript variable called data and needs to be initiated before you call the function. For static websites you can hardcode the JSON-structure in the HTML-document. If you're using PHP, you can use a MYSQL-query and format it before passing it down to the JavaScript function. Please take a look at the chapter **formatting data**
	  - The second argument is the method argument, this is a string that affects the appearance of the rendered graph. There are two arguments hardcoded in the script.
		  - "fast"
			  - Designed for large networks.
			  - No support for edgehovering (to increase performance)
			  - No labels (to increase performance)
			  - Batchedgesdrawing per 2000 (to increase performance)
			  - Hides edges on moving (to increase performance)
			  - Disabled Fruchterman-Reingold (there's no point in having this in large networks.)
		  - "precise"
			  - Designed for smaller networks.
			  - Edgehovering and edgeclick events are active
			  - With labels
			  - All edges are drawn at the same time
			  - Edges are visible at all time
			  - All layout functions are active

	 ```
		<script>
			create_spaghetti(data,method)
		</script>

		```

After this first <code>script</code> tag open a second tag to enable JSocials integration; this will help users to share the link to your website/dataset.

```
<script>
  // JSOC injection caller
    $("#share").jsSocials({
        shares: ["email", "twitter", "facebook", "googleplus"]
    });
</script>

```

You can now close the <code>body</code> tag.

### Formatting Data
Unlike traditional JavaScript GEXF-viewers, this tool takes JSON as data-input. You'll need to properly format the edges and nodes for this to work. Read through this chapter before creating your PHP-script as it will save you a ton of time. 

#### Edges
Edges are the lines that describe a relation between two nodes. They have a source and a target, meaning they have a certain direction. Each edge is also unique, and indicated by an ID.
##### Required components:
- id: This has to be a unique identifier (integer). You cannot have more than one edge with the same id.
- target: This is the destination of an edge, it is a node-id. (integer)
- source: This is where an edge originates, it is a node-id (integer)

##### Optional components:
You can add any optional components you want, to describe the relation between to nodes. Use keys that do NOT match the required components. If you add more components, then you'll have to add these to the codebase. For this see the chapter **code customization**.

#### Nodes ####
##### Required components: ####
- id: This is a unique identifier (integer). You cannot have more than one node with the same id.
##### Not required, but advised:
- label: This can be the name for a node. It is displayed when it's hovered and used in the information panel at Node-information, incoming relations and outgoing relations. 

##### Optional components: ####
These variables are not required by the JavaScript application, but if you have them, they'll give you more control over the end-result of the graph. 
- x: The X-coordinate of a node; this positions the node on the canvas.
	- See **code customization** ==> **positioning**
- y: The Y-coordinate of a node; this positions the node on the canvas.
	- See **code customization** ==> **positioning** 
- size: This determines how large a node must be. 
	- See **code customization** ==> **sizing**
- color:
	- See **code customization** ==> **color**


#### Valid JSON data ####

##### introduction #####
JSON or **J**ava**S**cript **O**bject **N**otation is a lightweight way of transmitting data from a server to a web browser. The transmitted data consists of text-only (so if your graph contains images for each node, you can't send the image directly, but you can send the URI or URL as text and use it later.). 

##### Constructing JSON data #####
First we'll give our JSON-data a name. This has to be done between <code>\<script></code> tags. 

So in your HTML or PHP script you'll have code like this: 

```
	<script>
		var json_data = {};


		// call the JavaScript function with this data:
  		create_spaghetti(json_data, "precise")
	</script>

```

The above code will send an empty JSON-object to the JavaScript function. To render a graph and parse valid JSON, the variable <code>json_data</code> will always need to contain two arrays. One array for the edges, a second array for the nodes. 

Insert these arrays in <code>json_data</code>
```
	<script>
		var json_data = 
		{"edges":[],
		 "nodes":[]
		};

		// call the JavaScript function with this data:
  		create_spaghetti(json_data, "precise")
	</script>

```

The code above calls the function, but has no valid edges or nodes. For this every edge needs to be inserted between the <code>[]</code> of the key <code>edges</code> and every node needs to be inserted between the <code>[]</code> of the key <code>nodes</code>.

We'll update the code above to reflect a network of four nodes and eight edges.

```
	<script>
		var json_data = 
		{"edges":[
			{"source":"0","target":"1","id":"0"},
			{"source":"0","target":"3","id":"1"},
			{"source":"1","target":"2","id":"2"},
			{"source":"1","target":"3","id":"3"},
			{"source":"1","target":"0","id":"4"},
			{"source":"2","target":"1","id":"5"},
			{"source":"2","target":"3","id":"6"},
			{"source":"3","target":"0","id":"7"}
		],
		 "nodes":[
			{"id":"0","label":"Zeus"},
			{"id":"1","label":"Poseidon"},
			{"id":"2","label":"Herakles"},
			{"id":"3","label":"Persephone"}
		]
		};

		// call the JavaScript function with this data:
  		create_spaghetti(json_data, "precise")
	</script>

```
The code above is enough to render a network. You can add more components to edges or nodes. Every component consists of a key and a value. Both are enclosed by quotes and separated by a colon. Components are separated from each other by commas.

This tool is specifically targeted at situations where the graph-data is generated on the fly and/or updated continuously. i.e. for situations where data is queried by the user dynamically and/or where a research team keeps adding nodes/edges to a database. As such it makes little sense to call the JavaScript function with static data as in this example.

A better practice is to combine PHP and JavaScript by making the <code>json_data</code> variable on the fly.

##### Helper tools #####
When working with JSON it's important that all brackets, braces, commas, colons and quotes are in their respective places. Misplacing one may lead to unreadable code. In situations where the graph isn't rendered, check the developer's console of your browser. If it says that there's a syntax error which originates in the html or php file, then chances are real you might have improperly formatted JSON.

Fortunately there are tools to detect this. A good online tool that seems to have little issues with larger JSON-objects is [JSONlint](https://jsonlint.com/). You can paste your JSON-code in there and click the *Validate JSON* button.

An alternative is to use a JSON validator plugin in your web browser. For Chromium based browsers you can use [Json Borne](https://chrome.google.com/webstore/detail/json-borne-json-validator/jdlfgjpngcbjpdkbobhijcpfaainabai?utm_source=chrome-ntp-icon). This tool will help you check if your JSON markup is valid (In some cases this tool might say that your markup is invalid, but the sigma libraries has built-in methods to handle this.).

#### Passing Node components from data to graph g. ####
Node components need to be pushed to the node array in <code>var g</code>. This happens by a <code>for loop</code>. This loops over all the data in <code>graph.nodes</code>, takes specific keys from it, and pushes those keys in <code>g.nodes</code> together with the corresponding value. 

You'll need to set up this behavior by editing the code. In the main JavaScript file look for a comment <code>//customize this code to push components from your data to g.nodes</code>

The <code>for loop </code> below that comment consists of two major parts. The first part creates variables and assigns a value to this. 

Example:<code> var id = graph.nodes[i]["id"];</code>
The <code>[i]</code> is used to iterate over graph.nodes and can be read as the i<sup>th</sup> element. Te string inside the second set of brackets, in this case <code>["id"]</code> relates to the keys in the JSON-data. It says that the variable id is value related to that <code>"id"</code> key for the <code>n<sup>th</sup></code> element of graph.nodes.

This has to be done for all components you want to push to g.nodes, make sure that every added component ends with a semicolon <code>;</code>

An alternative to retrieving the value for a variable from <code>graph.nodes</code> is to determine it on the fly. This is done by relying on functions. These functions are created specifically for one type of variable, i.e. the position, color or size variables which are determined by <code>positioner(coord, i)</code> function, <code>determincolor()</code> and the <code>determinesize(i)</code> function.

**positioner()** 

The positioner function takes in two arguments, a string, "x" or "y" and the iterator <code>i</code>. It will return the desired position for the x and y coordinates.

Depending on the configuration of the code (see: **code customization** ==> **positioning**), it will either return a calculated position, or extract the position from <code>graph.nodes</code>


**determinecolor()**

This function dynamically assigns colors to nodes it takes one argument which can be chosen by you. In the provided JavaScript code, it assigns colors based on the variable <code>typology</code>, which was extracted from <code>graph.nodes</code> earlier. As an alternative the nationality could also be used. If you add other variables (for instance: gender, profession, ...) that can be color-coded, you'll need to keep the following in mind:
  - Don't overdo it with colors, stick to a maximum of seven discernible colors. 
  - The argument used by the function must be extracted from <code>graph.nodes</code> before passing it to the function. 
  - You'd need to update the function called determinecolor(). (See: **code customization** ==> **color**)


By using the canvas-engine in sigma.js, the following ways of denoting colors are recommended:
  - HEX values: 	string		e.g.: "#ffffff"	(values between 0 and f)
  - RGB values:		string		e.g.: "rgb(125,210,65)" (comma separated values between 0 and 255)
  - RGBA values:	string		e.g.: "rgba(125,210,65,0.3)" (first three values are comma separated between 0 and 255. The 'a' value is a float between 0 and 1, indicating the transparency).

**determinesize()**

This function takes in one argument, the iterator <code>i</code>. Based on how the script is configured it will return a fixed size, which is later overwritten by a part of the sigma.js library or it will extract the size from <code>graph.nodes</code>. (See: **Code customization** ==> **sizing**

##### Adding a new component to your nodes. #####
In this section you'll learn how to add new components to each node. A component is used by the filter and gets automatically displayed in the information-pane on the left side of the screen.

Adding components consists of two steps (in some cases it can be done in one step, but to prevent confusion this documentation will only discuss the two-step method as it will work in all cases).

In the first step create a new variable and give it a descriptive name without spaces. Then set it equal to a certain key in <code>graph.nodes</code>. Since we want to do this for every note, we need to include the iterator <code>i</code> and the source <code>graph.nodes</code>. To conclude this first step, we'll need to call a key for the sake of this document, we'll call the key <code>day_of_birth</code>. Since this is pure JavaScript, you'll need to end each variable declaration by a semicolon <code>;</code>. A valid declaration looks like this: 

<code>var my_component = graph.nodes[i]["day_of_birth"];</code>

If we make it more abstract you write the code like this:

<code>var name = source[iterator]["key"];</code>

In the second step you'd need to push the declared variable to <code>g.nodes</code>. This happens in this code section:
<pre><code>g.nodes.push({
	component: variable_name,
	component2: other_variable,
	...
})</code></pre>

This code section consists of a key, a colon and a value. At this stage it is important to use keys that are self-explanatory as these keys are displayed in the filter and the information pane. 

A key can be written down as a string by the help of <code>"</code>, this is needed if the key contains a space. If your key does not contain a space, it can be written down without <code>"</code>. You can not use the same key twice!

There are some keys, which must remain in the push-section, if absent the graph won't render. These are:
  - id
  - x
  - y

Some other keys are of great importance to the functionality of this JavaScript application.
  - label: is used to display node information in the information pane and to show connected nodes.

All other keys can be discarded or replaced by your own, however some keys hold special meaning to sigma:
  - color: is used to color a graph (if absent all nodes will render white)
  - size: is used to determine the size of a graph. If absent Sigma will auto-determine the size unless <code>size_is_known=true</code> (see: **code customization** ==> **sizing**). 

Pushing the variable you declared in step one happens like this:

<code>Birthmonth: my_component,</code>

If we make it more abstract you write the code like this:

<code>key: variable_from_step_1,</code>

Alternatively, you can have more complex names for the key, in that case you need to write the key as a string. This is done with the help of quotes.

<code>"Month of birth": my_component,</code>

If we make it more abstract you write the code like this:

<code>"key as a string": variable_from_step_1,</code>

Note that every key:value pair is separated by a comma <code>,</code>. 


#### Passing Edge components from data to graph g. ####

Edges can be configured in a manner similar to the nodes. However, note that edge-hovering can be disabled. If it is disabled, less data is accessible in the graph itself. To make up for this, edge-information can be displayed in the information pane if it's explicitly asked by clicking on the E? next to each incoming or outgoing relation.

Editing edges-components happens in a way similar to adding nodes-components. The section responsible for this is indicated by a comment: <code>// Customize this code to push components from your data to g.edges.</code>

Edges can contain information on the type of relation that exists between two nodes. (e.g. family, author_of, inhabitant, etc...). 

There are some keys which must remain in the push-section. These are:
  - id
  - source
  - target

Other keys are optional, if absent, the sigma library will resort to its default values:
  - color: takes the color of the source-node.
  - type: becomes a straight line.
  - size: becomes a small line.

The same logic applies to pushing components to edges as to nodes. However, it's worth the time to take a closer look at how edges are pushed

<pre><code>
for (var i = 0; i < graph.edges.length; i++){
  // new variables go here.
  g.edges.push({
    id: graph.edges[i]["id"],
    source: graph.edges[i]["source"],
    target: graph.edges[i]["target"],
    color: edgescol,
    size: 1,
    type:"line",
  });
};
</code></pre>

As can be seen, the same construction is set-up, a for loop with an iterator <code>i</code> loops over <code>graph.edges</code>. 

At every iteration it pushes the <code>i<sup>th</sup></code> item to <code>g.edges</code>

When pushing to <code>g.edges</code>, the program assumes that the data you sent it, uses "id", "source" and "target" as keys in <code>graph.edges</code>. If you use other keys, change it here, otherwise your edges are <code>undefined</code>.

##### Adding a new component to your edges. #####
For the sake of giving an example we'll push the type of relation that exists between family-members to the edges. For this we assume that the data that was passed to the script holds this type of information for every edge stored under the key <code>fam_rel</code>.

We'll use the same two-step process, as before.

In the first step, look for <code>//new variables go here.</code> inside the for-loop; there you need to declare a new variable and set it equal to the value in <code>graph.edges</code>.

You code should look like this:

<code> var type_of_relation = graph.edges[i]["fam_rel"];</code>

If we make it more abstract the code works like this:

<code> var name_of_variable = source[iterator]["key"];</code>

Notice that every new var declaration has to end in a semicolon <code>;</code>

In the second step edit the part that pushes key:value-pairs to <code>g.edges</code>

Just like before create a descriptive key-name for instance "Family relation" and assign the variable from step one as a value.

Since the key used in this example contains a space, you need to use quotes. Your code should look like this: 

<code> "Family relation": type_of_relation,</code>

Notice that each key:value-pair is separated by a <code>,</code>. 

If everything is done correctly, the entire for-loop should look like this:

<pre><code>
for (var i = 0; i < graph.edges.length; i++){
  // new variables go here.
  var type_of_relation = graph.edges[i]["fam_rel"];
  g.edges.push({
    id: graph.edges[i]["id"],
    source: graph.edges[i]["source"],
    target: graph.edges[i]["target"],
    color: edgescol,
    size: 1,
    type:"line",
    "Family relation": type_of_relation,
  });
};
</code></pre>


### Code customization ###

This visualization tool allows for some convenient modifications at the top of the script. It mostly consists of boolean values (true/false). All values are indicated by a small comment. In this section of the documentation you'll find a more detailed description.

#### color ####
The function determinecolor() is responsible for assigning colors; it gets called with one argument and returns a color value (valid color values are RGBA, RGB and HEX).

Colors and what determines them need to be hard-coded in the script. Let's look at the function and see how to modify it.
<pre><code>
  // Assigning colors to type
function determinecolor(type){
  if (type==="author"){return "rgba(97,125,180,0.4)";}
  else if (type==="mythological figure"){return "rgba(102,143,60,0.4)";}
  else if (type==="transcriber"){return "rgba(0, 255, 0, 0.4)";}
  else if (type==="bard"){return "rgba(255, 0, 255,0.4)";}
  else if (type==="god"){return "rgba(94, 0, 163,0.4)";}
  else if (type==="demi god"){return "rgba(0, 255, 255,0.4)";}
  else{return"rgba(198,88,62,0.4)";}
};
</code></pre>

This function checks if the argument matches a certain string, this happens in the <code>if()</code>, <code>else if()</code> and <code>else</code> section of each line. If there's a match, it will return a certain color-code. In this case, it returns rgba-values.

So if the function gets called with "transcriber" as argument it'll iterate over the first and second if-statement without returning any color. When it reaches the third line, it will return "rgba(102,143,60,0.4)".

*Modifying*
This function can easily be modified. Let's consider a situation where there are four possible types that determine the color of a node.
  - dog
  - cat
  - horse
  - cow

For each of the animals (types) above, we want a specific HEX-color:
  - dog ==> "#42f48c"
  - cat ==> "#417df4"
  - horse ==> "#f141f4"
  - cow ==>  "#ce1818"

We'll also assume that, in the future, a fifth animal (type) may be present in the data or that some nodes may be invalid. For this we will use the else-case. The value relate to this else case will be returned if none of the <code>if</code> and <code>else if</code> statements were matched. Nodes like this will be color-coded as black ("#000000").

<pre><code>
  // Assigning colors to type
function determinecolor(type){
  if (type==="dog"){return "#42f48c";}
  else if (type==="cat"){return "#417df4";}
  else if (type==="horse"){return "#f141f4";}
  else if (type==="cow"){return "#ce1818";}
  else{return"#000000";}
};
</code></pre>

#### edgecolor ####
This tool enables one to use the same color for all edges, or to use the color from the source-node as color for the edge. 

<pre><code>
  // Set Edgecolor same as Nodecolor? (use true or false.)
	var edgecol_is_nodecol = false;         // use true or false
	var edgecol = "rgba(30,78,87,0.2)";     // if you set edgecol_is_nodecol = false; this will be the default color of edges.
</code></pre>

If <code>edgecol_is_nodecol</code> = <code>false</code> all edges will have one default color, this default color is determined by the variable <code>edgecol</code> below. This variable accepts: HEX, RGB and RGBA values. 

By setting <code>edgecol_is_nodecol</code> to <code>true</code> all edges will have the same color as the originating node. 

#### ignorelist ####
This list is used by the filtering-segment of the code to prevent certain components from being used as filters. There's for instance no point in allowing users to filter on the x or y, position of a node.

The <code>ignorelist</code> is a JavaScript array and looks like this:

<pre><code>
  // Filter ignorelist.
var ignorelist = ["id", "x", "y", "size", "color", "label"];
</code></pre>

The items in this list are enclosed by quotes, meaning that they are strings. Each item is separated by a comma. 

If your nodes for instance have an attribute called "rank", and you don't want to provide this as a filter-option, you'll need to append it to <code>ignorelist</code>. This can easily be done like this:

<code>var ignorelist = ["id", "x", "y", "size", "color", "label", "rank"];</code>

#### link_board ####
The link_board variable is a boolean, meaning it takes true or false as accepted values.

The code relating to this functionality looks like this: 

<pre><code>
// link graphboard to left side information panel. (This will link clickevents between the two information panel and graph visualization.)
var link_board = true;              // true or false
</code></pre>


*true* when set to <code>true</code> the information pane on the left-side of the screen can be used to control the appearance of the graph. Every time a node is clicked in the side panel, it will look for the corresponding node in the graph, and use that node to create an ego-network (i.e. displaying only the nodes that have a direct relation with the clicked node.

*false* when set to <code>false</code> the information pane on the left-side can be navigated without altering the appearance of the graph. 

#### node_ignore ####
<code>node_ignore</code> uses the same principles as <code>ignorelist</code> but affects another part of program-functionality.

This list is used by the information-displaying segment of the code to prevent certain node attributes from being shown to the user of the JavaScript application. There's for instance no point in showing users the rendered size of a node.

<code>node_ignore</code> is a JavaScript array and looks like this:

<pre><code>
  // Hides these attributes from the nodes in the onclick event:
var node_ignore = ["x", "y", "size", "color", "id", "hidden", "read_cam0:size", "read_cam0:x", "read_cam0:y", "renderer1:x", "renderer1:y", "renderer1:size", "dn_x", "dn_y", "dn_size", "dn"];


</code></pre>

The items in this list are enclosed by quotes, meaning that they are strings. Each item is separated by a comma.

If your nodes for instance have an attribute called "rank", and you don't want to display this information, you'll need to append it to <code>node_ignore</code>. This can easily be done like this:

<pre><code>var node_ignore = ["x", "y", "size", "color", "id", "hidden", "read_cam0:size", "read_cam0:x", "read_cam0:y", "renderer1:x", "renderer1:y", "renderer1:size", "dn_x", "dn_y", "dn_size", "dn", "rank"];
</code></pre>


#### edge_ignore ####
<code>edge_ignore</code> uses the exact same principles as <code>node_ignore</code> affecting the displayed information.

This list is used by the information-displaying segment of the code to prevent certain edge attributes from being shown to the user of the JavaScript application. There's for instance no point in showing users the id of an edge.

The script doesn't need to display the source and target of edges, in stead it looks up what node corresponds to that id; this is the <code>//notice</code> comment.


<pre><code>
  // hides these attributes form the edges in the onclick event:
      // NOTICE ==> source and target are not used directly; they are replaced by the correlating node-labels
var edge_ignore = ["color", "size", "id", "type", "hidden", "read_cam0:size", "renderer1:size", "source", "target"];
</code></pre>

#### filename ####
This JavaScript application enables users to export the rendered graph in jpg, png and svg. This section of the code allows you to set a name used by the export-functions of the code.

<pre><code>  
// Filename Export        Change this to alter the name of exported files.
var filename = "Trismegistos-Graph-Export";
var svg_size = 1920;
</code></pre>

The variable <code>filename</code> is a string and serves as the base for every exported graph. Users who download the jpg, png or svg to their computer will have a file that uses this string as a name. It is advised to choose something that allows users to recall where they got the image, making it easier to annotate or credit your site. 

The variable <code>svg_size</code> is an integer (a whole number) and is used by the SVG-export-function to determine how large an exported graph has to be. 


#### max_interactive_density ####
Size matters.... and it's not different for graphs.  Certain layout-optimizers make no sense to apply to large networks due to performance restrictions. To prevent users from clicking a button that would otherwise slow down their computer, leading to a bad user-experience of your site, a <code>max_interactive_density</code> variable was introduced. This variable is an integer (a whole number).

<pre><code>
  //This value will disable certain elements if there are more than x-nodes in your graph. This is useful to prevent
  //visitors from applying algorithms that are not suitable for large networks.
var max_interactive_density = 750;      // Integer value

</code></pre>

In this case, the maximum density is set to 750 nodes. If your graph exceeds this, then the code will alter it's execution by disabling:
  - The Fruchterman-Reingold-layout-algorithm.
  - The Noverlap-layout-algorithm.

In both cases the user will receive a tooltip when hovering the corresponding button saying that this functionality is "Disabled due to too large network."

You can always alter this value yourself by assigning a new integer value to it. 

#### positioning ####
This JavaScript application supports data where the coordinates are unknown, by calculating a square layout on the fly. It will however allow you to work with data where the coordinates are known. For this it uses three variables. 

<pre><code>
  //Positioning of nodes.
var positions_are_known = false;         // use true or false
var use_as_x = "your_x_coordinate";      // in your data, what key is used to denote the X-position of a node? (string)
var use_as_y = "your_y_coordinate";      // in your data, what key is used to denote the Y-position of a node? (string)
</code></pre>

The variable <code>positions_are_known</code> is a boolean. It'll accept true or false.
*false* If set to <code>false</code> the script will calculate the positions on the fly; resulting in a square layout. 

*true* if set to <code>true</code> the script will rely on the two other variables to extract the x and y coordinates from the data sent to the JavaScript application.

The variable <code>use_as_x</code> is a string. You'll need to provide the name of the key that is used in your data to indicate the x-position for each node. 

The variable <code>use_as_y</code> is a string. You'll need to provide the name of the key that is used in your data to indicate the y-position for each node. 

So in a situation where the coordinates are known, the x is indicated by a key called "here_is_x" and y is indicated by a key called "y_is_here". You'll need to update the code like this:

<pre><code>
  //Positioning of nodes.
var positions_are_known = true;         // use true or false
var use_as_x = "here_is_x";      // in your data, what key is used to denote the X-position of a node? (string)
var use_as_y = "y_is_here";      // in your data, what key is used to denote the Y-position of a node? (string)

</code></pre>

#### sizing ####
The JavaScript application supports cases where the size is unknown by using the built-in relativesize library from sigma.js. However, if the size is known and needs to be used, then you can override this behaviour.

<pre><code>
  //Do you have a fixed size in your argument for each node? If set to true, the program shall not overwrite this size.
var fixedsize = false;              // use true or false.
var nameforsize = "your_size_key";             // In your data, what key is used to denote the size of a node? (string)
</code></pre>

The variable <code>fixedsize</code> is a boolean (takes true or false). 

*false*: If set to <code>false</code>, the program will auto-calculate the size of each node.

*true*: If set to <code>true</code>, the program relies on a second variable to extract the correct value for each node from the data sent to the JavaScript application. 

The variable <code>nameforsize</code> is a string. You'll need to provide the name of the key that is used in your data to indication the size of each node. 

So in a situation where the size is known and is indicated by a key called "diameter", you'll need to update the code like this:

<pre><code>
  //Do you have a fixed size in your argument for each node? If set to true, the program shall not overwrite this size.
var fixedsize = true;              // use true or false.
var nameforsize = "diameter";             // In your data, what key is used to denote the size of a node? (string)
</code></pre>

By doing so the s.relativesize method won't be called in a later stage of the script; however, the size remains relative to the amount of nodes on the screen. I.e. a node with size 50 will be bigger when there are only 30 nodes in your network than when there are 3000 nodes in the network. This 'scale' is equally applied to all nodes. So a node A with size 10 and a node B with size 50 will hold their 1-to-5-ratio independently from the amount of nodes in the network.  


<hr>
<hr>

## Questions? ##
Prof. Dr. M Depauw: [Mark.Depauw@kuleuven.be ](mailto:Mark.Depauw@kuleuven.be )
