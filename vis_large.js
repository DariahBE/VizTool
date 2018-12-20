function create_spaghetti(graph, mode) {
// end-user programming required.

  // Assigning colors to variable defined in line 419
function determinecolor(type){
  if (type==="author"){return "rgba(97,125,180,0.6)";}
  else if (type==="mythological figure"){return "rgba(102,143,60,0.6)";}
  else if (type==="transcriber"){return "rgba(0, 255, 0, 0.6)";}
  else if (type==="bard"){return "rgba(255, 0, 255,0.6)";}
  else if (type==="god"){return "rgba(94, 0, 163,0.6)";}
  else if (type==="demi god"){return "rgba(0, 255, 255,0.6)";}
  else{return"rgba(224,57,0,1)";} //Standard color if not based on node attributes
}

  // Set Edgecolor same as Nodecolor? (use integers.)
  // use 0, 1 or 2 (everything else is seen as 2)
  // you MUST configure options for option1 in function edgecolor_assigner!
var edgecol_is_nodecol = 0;
                        //0 = edgecolor is determined by edgecol on line 22; all edges are the Same
                        //1 = edgecolor is customizable in the function edgecolor_assigner
                        //2 = all edgecolors are determined by the source-ID
var edgecol = "rgba(30,78,87,0.2)";     // if you set edgecol_is_nodecol = 0; this will be the default color of edges.

  // Filter ignorelist (users cannot filter on these properties).
var ignorelist = ["id", "x", "y", "size", "color", "label"];

// link graphboard to left side information panel. (This will link clickevents between the two information panel and graph visualization.)
var link_board = true;              // true or false

  // Hides these attributes from the nodes in the onclick event:
var node_ignore = ["x", "y", "size", "color", "id", "hidden", "read_cam0:size", "read_cam0:x", "read_cam0:y", "renderer1:x", "renderer1:y", "renderer1:size", "dn_x", "dn_y", "dn_size", "dn", "fr_x", "fr_y", "fr"];

  // hides these attributes form the edges in the onclick event:
      // NOTICE ==> source and target are not used directly; they are replaced by the correlating node-labels
var edge_ignore = ["color", "size", "id", "type", "hidden", "read_cam0:size", "renderer1:size", "source", "target", "count"];

  // Filename Export        Change this to alter the name of exported files.
var filename = "Trismegistos-Graph-Export";
var svg_size = 1920;

//This value will disable certain elements if there are more than x-nodes in your graph. This is useful to prevent
//visitors from applying algorithms that are not suitable for large networks.
var max_interactive_density = 750;      // Integer value

  //Positioning of nodes.
var positions_are_known = false;         // use true or false
var use_as_x = "your_x_coordinate";      // in your data, what key is used to denote the X-position of a node? (string)
var use_as_y = "your_y_coordinate";      // in your data, what key is used to denote the Y-position of a node? (string)

  //Do you have a fixed size in your argument for each node? If set to true, the program shall not overwrite this size.
var fixedsize = false;              // use true or false.
var nameforsize = "your_size_key";             // In your data, what key (label) is used to denote the size of a node? (string)


//Is the network directed or undirected? A network is undirected if a relation does not have an explicit direction.
var directed = false;				// use true or false

//Straight or curved edges?
var types_of_edges = ["arrow", "curvedArrow", "line", "curve"];
//                      1             2           3       4
var choose_this_edgetype =  4;      //An integer from 1 to 4 (Human Readable)

// Leave code below as is.
if (typeof(choose_this_edgetype) !== "number" || choose_this_edgetype < 1 || choose_this_edgetype > 4){
  choose_this_edgetype = 4;     //defaults to curve type
}
choose_this_edgetype = choose_this_edgetype-1;      // from Human Readable to JavaScript compliant array selector.
var edgetype = types_of_edges[choose_this_edgetype];

  //Filling Blackboard div.
document.getElementById("blackboard").innerHTML = '<div id="detail-container"><div class="side_panels_content"><div class="static"> <a href="https://www.kuleuven.be/kuleuven/" target="_blank"><img src="https://kuleuvencongres.be/eusea/images/kuleuven-logo-2012.png/image" alt="KUL" class="img-top"></a><a href="http://be.dariah.eu/" target="_blank"><img src="http://be.dariah.eu/sites/all/themes/dariah_be/logo.png" alt="Dariah-BE" class="img-top"></a> <p class="default-msg">Powered by: <a href="http://sigmajs.org/" target="_blank">sigma.js</a></p></div><div class="txt"><div id="holdinjected"></div> <div id="default-txt"> <p class="default-msg">For more details on a given node, click on it (aim well!). Details appear here.</p><p class="legend">Node legend</p><p class="paragraph" style="color: rgb(44,53,71)">author</p><p class="paragraph" style="color: rgb(110,54,99)">bard</p><p class="paragraph" style="color: rgb(34,63,122)">demi-god</p><p class="paragraph" style="color: rgb(255,187,0)">god</p><p class="paragraph" style="color: rgb(0,112,172)">mythological figure</p><p class="paragraph" style="color: rgb(10,169,198)">transcriber</p><p class="legend">Edge legend</p><p class="paragraph" style="color: rgb(97, 63, 37)">celtic</p><p class="paragraph" style="color: rgb(197, 165, 141)">etruscan</p><p class="paragraph", style="color: rgb(229, 225, 167)">greek</p><p class="paragraph" style="color: rgb(187, 182, 111)">roman</p></div></div><div class="searchbox" id="suggestions">Search:<input type="text" id="namesearch" title="Search this graph based on a label and create an ego network."></input></div></div></div><div id="graph-container"></div><div id="interaction"><div class="side_panels_content"> <div id="zoomcontrol"></div> <div class="controllers"><div id="accordion"> <h4>ForceAtlas2 <span class="openLayout">+</span><div id="snitch" title="This indicator shows you if ForceAtlas is still running. Red means that it\'s been stopped, green means that it\'s running. ForceAtlas is a continious layout algorithm and needs to be stopped explicitly"></div></h4><div><div class="FA_Options"><div id="scale_holder"><div class="display_unit"> <label for="scaling" title="ScalingRatio expands the graph, making it more sparse."><div>ScalingRatio: <input type="text" id="scaling" readonly style="border:0; background:none;"></div></label></div><div id="scaling_ratio" class="slider"></div></div><br><div id="gravity_holder"><div class="display_unit"><label for="gravity" title="Gravity attracts nodes to the center which prevents drifting nodes."><div>Gravity: <input type="text" id="gravity" readonly style="border:0; background:none;"></div></label></div><div id="gravity_factor" class="slider"></div></div><br><div id="slowdown_holder"><div class="display_unit"><label for="slowdown" title="Slowing down makes the nodes less prone to the repulsive forces from neighboring nodes. A higher value results in more stable nodes."><div>Slowdown: <input type="text" id="slowdown" readonly style="border:0; background:none;"></div></label></div><div id="slowdown_factor" class="slider"></div></div><br><div><label title="Makes the rendered clusters more tight by switching from lin-lin to lin-log(Andreas Noack). This is not recommended for small graphs.">LinLogmode:</label><div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="linlogswitch"><label class="onoffswitch-label" for="linlogswitch"></label><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></div><br><label title="Forces a compact graph by attracting distant nodes, this force can be too strong and thus results in a biased placement.">StrongGravityMode:</label><div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="heavy"><label class="onoffswitch-label" for="heavy"></label> <span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></div><br></div></div><div id="FA_controller"><div><i class="fa fa-play-circle" aria-hidden="true" style="color: #801515"></i><input value="run forceatlas2" id="skywalker" type="button"></div><div><i class="fa fa-stop-circle" aria-hidden="true" style="color: #801515"></i><input value="stop forceatlas2" id="darth_vader" type="button"></div></div></div><h4>Fruchterman-Reingold<span class="openLayout">+</span></h4><div><div class="FR_options"><div id="Fiterate_holder"><div class="display_unit"> <label for="iterator" title="How many times the algorithm is expected to run before rendering. WARNING: high values tend to be more precise, but are not suitable for large networks due to performance issues."><div>Iterations: <input type="text" id="iterator" readonly style="border:0; background:none;"></div></label></div><div id="iteration_ratio" class="slider"></div></div><br><div id="Fspeed_holder"><div class="display_unit"><label for ="F_speed" title="How fast the algorithms is expected to work. A higher value will give faster results at the cost of precision."><div>Speed: <input type="text" id="F_speed" readonly style="border:0; background:none;"></div></label></div><div id="speed_Fratio" class="slider"></div></div><br><div id="Fgrav_holder"><div class="display_unit"><label for ="F_gravity" title="This will attract all nodes to the center to avoid dispersion of unconnected nodes."><div>Gravity: <input type="text" id="F_gravity" readonly style="border:0; background:none;"></div></label></div><div id="gravity_Fratio" class="slider"></div></div><br></div><div id="FR_controller"></div></div></div><h4 class="filterheader">Node filters<span class="openLayout">+</span></h4><div id="filterholder"></div><h4 class="filterheader">Edge filters<span class="openLayout">+</span></h4><div id="filterholder2"></div><div id="deletefilter"></div><div id="exportbuttons"><h4>Options</h4></div><!-- holds the javascript buttons. --> <!-- no code here --> </div><div class="footer"> <p>If Trismegistos helped you, share and <a href="http://www.trismegistos.org/about_how_to_cite" target="_blank">cite</a> us.</p> <div id="share"></div> <!-- JSOC Injection --> </div></div></div>';

  //end of filling blackboard.
  // JQUERY UI SLiders and accordion
$(function() {
  $("#accordion").accordion({
  });
} );

$(function () {
    $(".ui-accordion-header").click(function () {
        $(".openLayout").text("+");
        $(".ui-state-active").find(".openLayout").text("‑");
    });
    $("#accordion").accordion({
        header: "h4",
        collapsible: true,
        active: false
    });
});

  $(function() {
    // Force Atlas sliders & buttons.
    $("#scaling_ratio").slider({
      range: "min",
      value: 1.0,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      slide: function(event, ui) {
        $("#scaling").val(ui.value );
      },
      stop: function(event, ui) {
        the_empire_strikes_back();
      }
    });
    $("#scaling").val($("#scaling_ratio").slider("value"));

    $("#gravity_factor").slider({
      range: "min",
      value: 1.0,
      min: 0.0,
      max: 10.0,
      step: 0.1,
      slide: function(event, ui) {
        $("#gravity").val(ui.value );
      },
      stop: function(event, ui) {
        the_empire_strikes_back();
      }
    });
    $("#gravity").val($("#gravity_factor").slider("value"));

    $("#slowdown_factor").slider({
      range: "min",
      value: 5.0,
      min: 0.1,
      max: 25.0,
      step: 0.1,
      slide: function(event, ui) {
        $("#slowdown").val(ui.value);
      },
      stop: function(event, ui) {
        the_empire_strikes_back();
      }
    });
    $("#slowdown").val($("#slowdown_factor").slider("value"));

    $("#linlogswitch").click(function(){the_empire_strikes_back();});
    $("#heavy").click(function(){the_empire_strikes_back();});

    // Fruchterman Reingold sliders.
    $("#iteration_ratio").slider({
        range: "min",
        value: 3,
        min: 1,
        max: 200,
        step: 1,
        slide: function(event, ui) {
        $("#iterator").val(ui.value);
      },
        stop: function(event,ui){
          fruchterman_func();
        }
      });
      $("#iterator").val($("#iteration_ratio").slider("value"));

    $("#speed_Fratio").slider({
        range: "min",
        value: 1.0,
        min: 0.1,
        max: 5,
        step: 0.1,
        slide: function(event, ui) {
          $("#F_speed").val(ui.value);
        },
          stop: function(event,ui){
            fruchterman_func();
          }
      });
      $("#F_speed").val($("#speed_Fratio").slider("value"));

    $("#gravity_Fratio").slider({
        range: "min",
        value: 5,
        min: 0,
        max: 100,
        step: 1,
        slide: function(event, ui) {
          $("#F_gravity").val(ui.value);
        },
          stop: function(event,ui){
            fruchterman_func();
          }
      });
      $("#F_gravity").val($("#gravity_Fratio").slider("value"));

  });

var use_the_force = false;

// ForceAtlas builder functionality (Explicit)
document.getElementById("skywalker").onclick = function(){
  var grav = $("#gravity_factor").slider("option", "value");
  var scal = $("#scaling_ratio").slider("option", "value");
  var slow = $("#slowdown_factor").slider("option", "value");
  var linlog = document.getElementById("linlogswitch").checked;
  var heavy = document.getElementById("heavy").checked;
  use_the_force = true;
  yoda(true, grav, scal, slow, linlog, heavy);
};

//ForceAtlas: Implicit builder (only active if use_the_force = true)
function the_empire_strikes_back() {
  if (use_the_force){
  yoda(false);

  var grav = $("#gravity_factor").slider("option", "value");
  var scal = $("#scaling_ratio").slider("option", "value");
  var slow = $("#slowdown_factor").slider("option", "value");
  var linlog = document.getElementById("linlogswitch").checked;
  var heavy = document.getElementById("heavy").checked;

  yoda(true, grav, scal, slow, linlog, heavy);
  }
}

document.getElementById("darth_vader").onclick = function(){
    use_the_force = false;
    yoda(false);
};

  //creating buttons on screen.
var allow_fruchterman = false;
var fruchterman_run = document.createElement("i");
fruchterman_run.setAttribute("class", "fa");
fruchterman_run.classList.add("fa-play-circle");
fruchterman_run.setAttribute("aria-hidden", "true");
fruchterman_run.setAttribute("style", "color: #801515");
var fruchterman_start= document.createElement("INPUT");
fruchterman_start.setAttribute("type", "button");
fruchterman_start.setAttribute("value", "run fruchterman");
fruchterman_start.setAttribute("id", "milleniumfalcon");
if (graph.nodes.length > max_interactive_density){
  fruchterman_start.setAttribute("disabled", "disabled");
  fruchterman_start.setAttribute("title","Disabled due to too large network.");
}
document.getElementById("FR_controller").appendChild(fruchterman_run);
document.getElementById("FR_controller").appendChild(fruchterman_start);
document.getElementById("milleniumfalcon").onclick = function(){
    allow_fruchterman = true;
    fruchterman_func();
};

var noverlap_FA = document.createElement("div");
noverlap_FA.id = "noverlap1";
noverlap_FA.innerHTML = "<i class='fa fa-play-circle' aria-hidden='true' style='color: #801515'></i>";
var noverlapFA_input = document.createElement("INPUT");
noverlapFA_input.setAttribute("type", "button");
noverlapFA_input.setAttribute("value", "run noverlap");
noverlapFA_input.setAttribute("class", "shepherd");
if (graph.nodes.length > max_interactive_density){
  noverlapFA_input.setAttribute("disabled", "disabled");
  noverlapFA_input.setAttribute("title","Disabled due to too large network.");
}
noverlap_FA.appendChild(noverlapFA_input);
document.getElementById("FA_controller").appendChild(noverlap_FA);
document.getElementById("noverlap1").onclick = function(){
    mass_effect();
};

var noverlap_FR = document.createElement("div");
noverlap_FR.id = "noverlap2";
noverlap_FR.innerHTML = "<i class='fa fa-play-circle' aria-hidden='true' style='color: #801515'></i>";
var noverlapFR_input = document.createElement("INPUT");
noverlapFR_input.setAttribute("type", "button");
noverlapFR_input.setAttribute("value", "run noverlap");
noverlapFR_input.setAttribute("class", "shepherd");
if (graph.nodes.length > max_interactive_density){
  noverlapFR_input.setAttribute("disabled", "disabled");
  noverlapFR_input.setAttribute("title","Disabled due to too large network.");
}
noverlap_FR.appendChild(noverlapFR_input);
document.getElementById("FR_controller").appendChild(noverlap_FR);
document.getElementById("noverlap2").onclick = function(){
    mass_effect();
};

var exportOptions = document.createElement("p");
var exportText = document.createTextNode("Export options:");
exportOptions.appendChild(exportText);
exportOptions.setAttribute("class", "options-text");
document.getElementById("exportbuttons").appendChild(exportOptions);

var savesvg = document.createElement("INPUT");
savesvg.setAttribute("type", "button");
savesvg.setAttribute("value", "svg");
savesvg.setAttribute("id", "export");
document.getElementById("exportbuttons").appendChild(savesvg);

var savejpg = document.createElement("INPUT");
savejpg.setAttribute("type","button");
savejpg.setAttribute("value", "jpg");
savejpg.setAttribute("id","exportjpg");
document.getElementById("exportbuttons").appendChild(savejpg);

var savepng = document.createElement("INPUT");
savepng.setAttribute("type","button");
savepng.setAttribute("value", "png");
savepng.setAttribute("id","exportpng");
document.getElementById("exportbuttons").appendChild(savepng);
// end of Buttons.

// initiating graph
var g = {
  nodes:[],
  edges:[]
};

// setting boundaries on node- and edgesize by total amount of nodes.
var totalnodes = graph.nodes.length;
var nodesize = 20;
var edgesize = 8;
var factor = 0.9;
//This will make the graph nodes & edges scale to "fit the screen". Smaller networks will have larger nodes, whereas large networks
//will have smaller nodes. Relatively speaking however, the factor from smallest to largest node in a network of size X is fixed!!
// Smaller networks will also have a lower calculated labelThreshold (i.e nodesize*factor)
if(totalnodes > 20000){
  nodesize = nodesize*0.25;
  edgesize = edgesize*0.2;
  factor = 0.9;
}else if (totalnodes > 10000){
  nodesize = nodesize*0.3;
  edgesize = edgesize*0.25;
  factor = 0.89;
} else if (totalnodes > 8000){
  nodesize = nodesize*0.35;
  edgesize = edgesize*0.3;
  factor = 0.88;
}else if (totalnodes > 6000){
  nodesize = nodesize*0.4;
  edgesize = edgesize*0.35;
  factor = 0.87;
}else if (totalnodes > 4000){
  nodesize = nodesize*0.45;
  edgesize = edgesize*0.4;
  factor = 0.86;
}else if (totalnodes > 2000){
  nodesize = nodesize*0.5;
  edgesize = edgesize*0.45;
  factor = 0.85;
}else if (totalnodes > 1000){
  nodesize = nodesize*0.6;
  edgesize = edgesize*0.5;
  factor = 0.84;
}else if (totalnodes > 750){
  nodesize = nodesize*0.7;
  edgesize = edgesize*0.6;
  factor = 0.83;
}else if (totalnodes > 500){
  nodesize = nodesize*0.8;
  edgesize = edgesize*0.7;
  factor = 0.81;
}else if (totalnodes > 400){
  nodesize = nodesize;
  edgesize = edgesize*0.8;
  factor = 0.79;
}else if (totalnodes > 300){
  nodesize = nodesize*1.25;
  edgesize = edgesize*0.9;
  factor = 0.77;
}else if (totalnodes > 200){
  nodesize = nodesize*1.5;
  edgesize = edgesize;
  factor = 0.75;
}else if (totalnodes > 100){
  nodesize = nodesize*1.75;
  edgesize = edgesize*1.10;
  factor =0.73;
}else if (totalnodes > 50){
  nodesize = nodesize*2;
  edgesize = edgesize*1.15;
  factor = 0.71;
} else {
  nodesize = nodesize*2.25;
  edgesize = edgesize*1.2;
  factor = 0.67;
}

// initiating loop
  // Creating X and Y for graphs with unknown layouts
  var side = parseInt(Math.sqrt(graph.nodes.length)+1);
  var yside = 1;  // if this starts at 0 there's a bug triggered in the sigma framework that prohibits showing edgehover
  var xside = 1;
  function positioner(coord,i){
      // if the position is unknown (false); function will calculate.
    if (!(positions_are_known)){
      if(coord === "x"){
        return xside;
      } else if (coord === "y"){
        return yside;
      }
    }else{
      if(coord === "x"){
        return graph.nodes[i][use_as_x];
      }else if (coord === "y"){
        return graph.nodes[i][use_as_y];
      }
    }
  }

function determinesize(i){
  if (!fixedsize){
    return 1;
  } else {
    return graph.nodes[i][nameforsize];
  }
}

// Customize this code to push node components from your data to g.nodes.
for (var i = 0; i < graph.nodes.length; i++){
    var id = graph.nodes[i]["id"];
    var label = graph.nodes[i]["label"];
    var typology = graph.nodes[i]["type"]
    var nomos = graph.nodes[i]["nomos"];
    var xpos = positioner("x",i);
    var ypos = positioner("y",i);
    var size =  determinesize(i);
    var color = determinecolor(typology);        //this re-uses the typology variable to assign colors. You can use other variables as well.
    xside = xside +1;
    if ((xside >= side) && (!positions_are_known)){
      xside = 1;
      yside = yside+1;
    }
    g.nodes.push({
      id: id,
      label: label,
      nome: nomos,
      x: xpos,
      y: ypos,
      size: size,                 // you can force this to use a 'null' value if needed,-; but then disable the sigma.plugins.relativeSize functionality later in the script
      color: color,
    });
  }

function edgecolor_assigner(state, alt, source, target, me){
  if (state === 0){
    return alt;
  }else if (state === 1){
    // for a more granular control set edgecol_is_nodecol to false and use source/target attribute or additional attributes to determine edgecolor type.
    /*EXAMPLE: edgecolor based on source's nationality attribute.*/
    base = graph.edges[me]["period"];
    if (base === "roman"){return "rgba(255,0,0,0.2)";}
    else if (base === "greek") {return "rgba(0,200,200,0.2)";}
    else if (base === "etruscan"){return "rgba(200,200,0,0.2)";}
    else if (base === "celtic"){return "rgba(100,255,20,0.2)";}
    else if (base === "GR"){return "rgba(200,200,200, 0.7)"}
    else if (base === "unknown"){return null;}// Null will make the edgecolor render as SOURCEnode color.
    else {return alt;}      // if case isn't set, make alt!
    /*Delete code above for alt-color on all edges */
    //return alt;
  }else{      //(option 2 is implied)
    return null;
  }
}

var countlog = {};
function setcount(from, to){
  var setcountid = from.toString()+"-"+to.toString();
  if (!(setcountid in countlog)){
    countlog[setcountid]=0;
    return 0;
  }else{
    countlog[setcountid]=countlog[setcountid]+1;
    return countlog[setcountid]+1;
  }
}

// Customize this code to push edge components from your data to g.edges.
var gsrc = null;
var gtg = null;
var eid = null
for (i = 0; i < graph.edges.length; i++){
  gsrc = graph.edges[i]["source"];
  gtg = graph.edges[i]["target"];
  eid = graph.edges[i]["id"];
  g.edges.push({
    id: eid,
    source: gsrc,
    target: gtg,
    color: edgecolor_assigner(edgecol_is_nodecol,edgecol,gsrc,gtg, eid),
    size: 1,
    type: edgetype,
    count: setcount(gsrc, gtg),
    period: graph.edges[i]["period"]
  });
}

countlog = null; //I don't need this object so kill it
/*
 This function takes the settings name  used in the sigma instances as input (i.e. variable_input)
 based on that and the mode that's been declared in the main function it returns values that are
 optimized for a specific graph.
*/

function modevar(variable_input){
  if (variable_input === "edgehover"){
    if(mode === "fast"){return false;}
    else if(mode === "precise"){return true;}
  }
  else if (variable_input === "drawlabels"){
    if(mode === "fast"){return false;}
    else if(mode === "precise"){return true;}
  }
  else if (variable_input === "edgemove"){
    if(mode === "fast"){return true;}
    else if(mode === "precise"){return false;}
  }
  else if (variable_input === "batchedges"){
    if(mode === "fast"){return true;}
    else if(mode === "precise"){return false;}
  }
}

s = new sigma({
  graph: g,
  renderer: {
    container: document.getElementById("graph-container"),
    type: "canvas",
  },
  settings: {
    edgeLabelSize: "fixed",     //fixed (default) or proportional (Performance killer) ==> Proportiional not needed because of s.plugins.relativeSize!
    minNodeSize: nodesize/10,
    maxNodeSize: nodesize,
    minEdgeSize: edgesize/20,
    maxEdgeSize: edgesize/2,
    autoRescale: "nodes.size",
    autoResize: "nodes.size",
    enableEdgeHovering: modevar("edgehover"),// if set to true this kills browser performance.
    edgeHoverExtremities: true,             // triggers labels to display on edgehover of connected nodes.
    defaultNodeColor:"#ffffff",
    mouseEnabled: true,
    touchEnabled: true,
    batchEdgesDrawing: modevar("batchedges"), // default: false; true is perforamnce gain!
    hideEdgesOnMove: modevar("edgemove"),
    canvasEdgesBatchSize: 2000,
    drawLabels: modevar("drawlabels"),
    labelThreshold: nodesize*factor
  }
});

// forces relative size of nodes based on neighbours.

if (!fixedsize){
sigma.plugins.relativeSize(s,2); // (object, startSize)
}
s.refresh();

// Enables Force Atlas on Request.
function yoda(the_force, grav, scal, slow, linlog, heavy) {
  function optimizer(){
    if(graph.nodes.length>500){           // on smaller networks you do more harm than good with barnesHutOptimization.
      return true;
    }else{
      return false;
    }
  }
if (the_force){
  document.getElementById("snitch").style.backgroundColor="green";
  var fa_options = {
    worker: true,
    barnesHutOptimize: optimizer(),
    startingIternations: 200,
    interationsPerRender:20,
    linLogMode:linlog,
    gravity:grav,
    scalingRatio:scal,
    slowDown:slow,
    strongGravityMode:heavy,
    outboundAttractionDistribution:true,
    adjustSize:true,
    edgeWeightInfluence:2,
    barnesHutTheta:1};
  s.startForceAtlas2(fa_options);
}else{
    document.getElementById("snitch").style.backgroundColor="red";
  s.killForceAtlas2();
}
}

// fruchterman Reingold function
function fruchterman_func(){
  if (allow_fruchterman){
    var fgrav = $("#gravity_Fratio").slider("option", "value");
    var fspeed = $("#speed_Fratio").slider("option", "value");
    var fiter = $("#iteration_ratio").slider("option", "value");
    var fruchtermanconfig = {
      autoArea: true,
      easing: true,
      duration: 2000,
      gravity: fgrav,
      speed: fspeed,
      iterations: fiter
    };
      sigma.layouts.fruchtermanReingold.start(s, fruchtermanconfig);
    }
  }

function mass_effect() {
  var config = {
    nodeMargin: 3.0,
    scaleNodes: 2,
    gridSize: 1000,
    easing: true,
    maxIterations: 5,
    speed: 30
  };
  s.startNoverlap(config);
}

// Show relations based on in and outbound data.
function showrelation(edgeid){
  for (var ed = 0; ed <graph.edges.length; ed++){
    if(g.edges[ed].id === edgeid){
      document.getElementById("holdinjected").innerHTML = "";     // emptying div
      document.getElementById("holdinjected").innerHTML = "<h2>Edge info</h2>";
      var edge_src = g.edges[ed].source;
      var edge_trg = g.edges[ed].target;
      var edge_src_label = lookup_id(edge_src);
      var edge_trg_label = lookup_id(edge_trg);
      if (directed === true) {
  		    var inject_edge_data_only = "<p>Source: <span id='"+edge_src+"' class='hotlink_node'>"+edge_src_label+"</span></p><p>Target: <span id='"+edge_trg+"' class='hotlink_node'>"+edge_trg_label+"</span></p>";
  	  }else{
  		    var inject_edge_data_only = "<p>Node1: <span id='"+edge_src+"' class='hotlink_node'>"+edge_src_label+"</span></p><p>Node2: <span id='"+edge_trg+"' class='hotlink_node'>"+edge_trg_label+"</span></p>";
  	  }
      var object_keys_edge = Object.keys(g.edges[ed]);
      for (var ek = 0; ek <object_keys_edge.length; ek++){
        if(edge_ignore.indexOf(object_keys_edge[ek])<0){
          inject_edge_data_only += "<p>"+object_keys_edge[ek]+": "+g.edges[ed][object_keys_edge[ek]]+"</p>";
        }
      }
      document.getElementById("holdinjected").innerHTML +=inject_edge_data_only;
      break;
    }
  }
}
function shownode(nodeid, source){
  for (var n=0; n<g.nodes.length; n++){
    if (g.nodes[n].id === nodeid){
      var inject_node_data = "<h2>Node info</h2>";
      var outboundrelations = "";
      var inboundrelations = "";
      var object_keys_node = Object.keys(g.nodes[n]);
      for (var nk = 0; nk <object_keys_node.length; nk++){
        if (node_ignore.indexOf(object_keys_node[nk])<0){
          inject_node_data += "<p>"+object_keys_node[nk]+": "+g.nodes[n][object_keys_node[nk]]+"</p>";
        }
      }
      var outtargets = [];
      var intargets = [];
      var temparr=[];
          // detecting outbound relations.
      for (var outrel = 0; outrel <g.edges.length; outrel ++){
        if ( g.edges[outrel].source === nodeid){
          temparr.push(g.edges[outrel].target);
          temparr.push(g.edges[outrel].id);
          outtargets.push(temparr);}
          temparr=[];
      }
      for (var inrel = 0; inrel <g.edges.length; inrel ++){
        if ( g.edges[inrel].target === nodeid){
          temparr.push(g.edges[inrel].source);
          temparr.push(g.edges[inrel].id);
          intargets.push(temparr);}
          temparr = [];
          }
      if (link_board &&(source != "graph")){
        s.graph.nodes().forEach(function(n){
          n.hidden=true;
        });
        s.graph.edges().forEach(function(p){
          if ((p.target===nodeid) || (p.source===nodeid)){
            p.hidden=false;
            s.graph.nodes(p.target).hidden=false;
            s.graph.nodes(p.source).hidden=false;
          }else{
            p.hidden=true;
          }});
        s.refresh();
      }
      // assigning names(label) to outbound relations.
   for (var otrg = 0; otrg <outtargets.length; otrg++){
     s.graph.nodes().forEach(function(n){
       if(n.id === outtargets[otrg][0]){
         outboundrelations = outboundrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+outtargets[otrg][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"'title='click for more information on this node'>N?</span> </p>";
       }
     });
   }

   for (var intrg = 0; intrg <intargets.length; intrg++){
     s.graph.nodes().forEach(function(n){
       if(n.id === intargets[intrg][0]){
         inboundrelations = inboundrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+intargets[intrg][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"' title='click for more information on this node'>N?</span> </p>";
       }
     });
   }
   if (directed === true){
   		document.getElementById("holdinjected").innerHTML=inject_node_data + "<h3>Outgoing relations: "+outtargets.length+"</h3>"+ outboundrelations + "<h3>Incoming relations: "+intargets.length+"</h3>"+ inboundrelations;
   	} else{
   	var allrelations = intargets.concat(outtargets);
    var mutualrelations = "";		// if the network is undirected
   	for (var itterator = 0; itterator <allrelations.length; itterator++){
   		s.graph.nodes().forEach(function(n){
   			if(n.id === allrelations[itterator][0]){
   				mutualrelations = mutualrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+allrelations[itterator][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"' title='click for more information on this node'>N?</span> </p>";
   			}
   		});
   	}
    document.getElementById("holdinjected").innerHTML=inject_node_data + "<h3>Relations: "+allrelations.length+"</h3>" + mutualrelations;//+ outboundrelations + "<h3>Incoming relations: "+intargets.length+"</h3>"+ inboundrelations;
   }
   document.getElementById("default-txt").style.display = "none";
   document.getElementById("holdinjected").setAttribute("style", "display: block;");
   break;
  }
  }

}

// custom code (show node information)
s.bind("clickNode", function (e) {
  var inject_node_data = "<h2>Node info</h2>";
  var outboundrelations = "";
  var inboundrelations = "";
  var ego = e.data.node.id;
  var object_keys_node = Object.keys(e.data.node);
  for (var nk = 0; nk <object_keys_node.length; nk++){
    if (node_ignore.indexOf(object_keys_node[nk])<0){
      inject_node_data += "<p>"+object_keys_node[nk]+": "+e.data.node[object_keys_node[nk]]+"</p>";
    }
  }
  var outtargets = [];
  var intargets = [];
  var temparr=[];
  var mutualrelations = "";		// if the network is undirected
      // detecting outbound relations.
  for (var outrel = 0; outrel <graph.edges.length; outrel ++){
    if ( graph.edges[outrel].source === ego){
      temparr.push(graph.edges[outrel].target);
      temparr.push(graph.edges[outrel].id);
      outtargets.push(temparr);}
      temparr=[];
  }
      // detecting incoming relations.
  for (var inrel = 0; inrel <graph.edges.length; inrel ++){
    if ( graph.edges[inrel].target === ego){
      temparr.push(graph.edges[inrel].source);
      temparr.push(graph.edges[inrel].id);
      intargets.push(temparr);}
      temparr = [];
  }
     // assigning names(label) to outbound relations.
  for (var otrg = 0; otrg <outtargets.length; otrg++){
    s.graph.nodes().forEach(function(n){
      if(n.id === outtargets[otrg][0]){
        outboundrelations = outboundrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+outtargets[otrg][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"'title='click for more information on this node'>N?</span> </p>";
      }
    });
  }

  for (var intrg = 0; intrg <intargets.length; intrg++){
    s.graph.nodes().forEach(function(n){
      if(n.id === intargets[intrg][0]){
        inboundrelations = inboundrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+intargets[intrg][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"' title='click for more information on this node'>N?</span> </p>";
      }
    });
  }
  if (directed === true){
	  document.getElementById("holdinjected").innerHTML=inject_node_data + "<h3>Outgoing relations: "+outtargets.length+"</h3>"+ outboundrelations + "<h3>Incoming relations: "+intargets.length+"</h3>"+ inboundrelations;
  }else{
	var allrelations = intargets.concat(outtargets);
	for (var itterator = 0; itterator <allrelations.length; itterator++){
		s.graph.nodes().forEach(function(n){
			if(n.id === allrelations[itterator][0]){
				mutualrelations = mutualrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+allrelations[itterator][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"' title='click for more information on this node'>N?</span> </p>";
			}
		});
	}
	document.getElementById("holdinjected").innerHTML=inject_node_data + "<h3>Relations: "+allrelations.length+"</h3>"+ mutualrelations;
}
  document.getElementById("default-txt").style.display = "none";
  document.getElementById("holdinjected").setAttribute("style", "display: block;");
});

var send_id = 0;
$(document).on("click", ".hotlink_edge", function(){
  send_id = this.getAttribute("id");
  showrelation(send_id);
});

$(document).on("click", ".hotlink_node", function(){
  send_id = this.getAttribute("id");
  shownode(send_id);
});
// custom edgeclick

function lookup_id(value){
  for (var lookup = 0; lookup < graph.nodes.length; lookup++){
    if (graph.nodes[lookup].id === value){
      return(graph.nodes[lookup].label);
    }
  }
}

s.bind("clickEdge", function(e) {
  // numerical values for source and target are replaced by the node labels!
  // If the numerical values are URI's, then you can use them to make a hyperlink to that unique page, using the label as clickable text.
  var inject_edge_data = "<h2>Edge info</h2> ";
  var object_keys_edge = Object.keys(e.data.edge);
  var edge_src = e.data.edge.source;
  var edge_trg = e.data.edge.target;
  var edge_src_label = lookup_id(edge_src);
  var edge_trg_label = lookup_id(edge_trg);
  if (directed === true){
	inject_edge_data += "<p>Source: <span id='"+edge_src+"' class='hotlink_node'>"+edge_src_label+"</span></p><p>Target: <span id='"+edge_trg+"' class='hotlink_node'>"+edge_trg_label+"</span></p>";
  } else{
	inject_edge_data += "<p>Node1: <span id='"+edge_src+"' class='hotlink_node'>"+edge_src_label+"</span></p><p>Node2: <span id='"+edge_trg+"' class='hotlink_node'>"+edge_trg_label+"</span></p>";
  }
  for (var ek = 0; ek <object_keys_edge.length; ek++){
    if(edge_ignore.indexOf(object_keys_edge[ek])<0){
      inject_edge_data += "<p>"+object_keys_edge[ek]+": "+e.data.edge[object_keys_edge[ek]]+"</p>";
    }
  }
  document.getElementById("holdinjected").innerHTML = inject_edge_data;
  document.getElementById("default-txt").style.display = "none";
  document.getElementById("holdinjected").style.display = "block";
});
// custom stageclick.
s.bind("clickStage", function(){
  document.getElementById("default-txt").style.display = "block";
  document.getElementById("holdinjected").style.display = "none";
  document.getElementById("holdinjected").innerHTML = "";     // emptying div
});


// save as svg.
document.getElementById("export").onclick = function() {
  var trismegistos_graph_svg_export = s.toSVG({download: true, filename: filename+".svg", size: svg_size});
};

//save as JPG
document.getElementById("exportjpg").onclick =function() {
  s.renderers[0].snapshot({
    download: true,
    format: "jpg",
    background: "white",
    labels: true,
    filename: filename+".jpg"
  });
};

//save as PNG
document.getElementById("exportpng").onclick =function() {
  s.renderers[0].snapshot({
    download: true,
    format: "png",
    background: "",
    labels: true,
    filename: filename+".png"
  });
};

//Node and edge filters version 2
//sigma filtering globals
var filteroptions = [];

//sigma filtering resets
function reset(){
  filteroptions = [];

  for (var key in attributenames){
    document.getElementById('node-filter-'+key).selectedIndex= 0;
  }

  for (var key in edge_attributenames){
    document.getElementById('edge-filter-'+key).selectedIndex = 0;
  }
}
//end of sigma filterobject resets

//Sigma filtering for nodes!
var filter = new sigma.plugins.filter(s);
  // creating attribute filters.
  var attributenames = {};
  var objectkeys = (Object.keys(g.nodes[0]));
  for(i=0; i<objectkeys.length; i++){
    if (ignorelist.indexOf(objectkeys[i])<0){
      attributenames[objectkeys[i]] = [];
    }
  }

// Returns unique filtering options.
  function singularity(input){
    var single = [];
    for(a=0; a<input.length; a++){
      if(single.indexOf(input[a]) === -1){
        single.push(input[a]);
      }
    }
    return single;
}

for (var attribute in attributenames){
  s.graph.nodes().forEach(function(node) {
    attributenames[attribute].push(node[attribute]);
  });
  attributenames[attribute]= singularity(attributenames[attribute]);
}

var filterbox = document.createElement("div");
filterbox.setAttribute("id", "filtercontainer");
document.getElementById("interaction").appendChild(filterbox);
document.getElementById("filterholder").innerHTML+="<p class='filter-title'>Operator:</p>";
var operator = document.createElement("SELECT");
operator.setAttribute("id","ddoperator");
operator.setAttribute("title","Select the operator first, this operator applies to the chose attributevalue.");
document.getElementById("filterholder").appendChild(operator);

var edge_attributenames = {};
var edge_objectkeys = (Object.keys(g.edges[0]));
for(i=0; i<edge_objectkeys.length; i++){
  if (edge_ignore.indexOf(edge_objectkeys[i])<0){
    edge_attributenames[edge_objectkeys[i]] = [];
  }
}
for (edge_attribute in edge_attributenames){
  s.graph.edges().forEach(function(edge) {
    edge_attributenames[edge_attribute].push(edge[edge_attribute]);
  });
  edge_attributenames[edge_attribute]= singularity(edge_attributenames[edge_attribute]);
}

var operatorlist = [["OR","or"], ["NOT","not"]];

for (o =0; o < operatorlist.length; o++){
  var logical = document.createElement("OPTION");
  logical.text = operatorlist[o][0];
  logical.value = operatorlist[o][1];
  document.getElementById("ddoperator").appendChild(logical);
}

for (var key in attributenames){
  var option = document.createElement("SELECT");
  option.setAttribute("id","node-filter-"+key);
  option.setAttribute("class","filtermain");
  option.setAttribute("title", "Click an option to apply the operator to, the selected option for '"+key+"' gets pushed as a filter when it is clicked");
  document.getElementById("filterholder").innerHTML+="<p class='filter-title'>"+key+": </p>";
  document.getElementById("filterholder").appendChild(option);
  var defaulter = document.createElement("OPTION");
  defaulter.text = "select option";
  defaulter.setAttribute("selected", true);
  defaulter.setAttribute("disabled", true);
  document.getElementById("node-filter-"+key).appendChild(defaulter);
  for (var x in attributenames[key]){
    var prop = attributenames[key][x];
    var property = document.createElement("OPTION");
    property.setAttribute("value", prop);
    var classfiller = key + " attributeoption";
    property.setAttribute("class", classfiller);
    property.setAttribute("id", "node-filter-"+prop);
    property.text = prop;
    document.getElementById("node-filter-"+key).appendChild(property);
  }
}

for (key in edge_attributenames){
  option = document.createElement("SELECT");
  option.setAttribute("id","edge-filter-"+key);
  option.setAttribute("class","edge_filtermain");
  option.setAttribute("title", "Click an option to apply the operator to, the selected option for '"+key+"' gets pushed as a filter when it is clicked");
  document.getElementById("filterholder2").innerHTML+="<p class='filter-title'>"+key+": </p>";
  document.getElementById("filterholder2").appendChild(option);
  defaulter = document.createElement("OPTION");
  defaulter.text = "select option";
  defaulter.setAttribute("selected", true);
  defaulter.setAttribute("disabled", true);
  document.getElementById("edge-filter-"+key).appendChild(defaulter);
  for (x in edge_attributenames[key]){
    prop = edge_attributenames[key][x];
    property = document.createElement("OPTION");
    property.setAttribute("value", prop);
    classfiller = key + " attributeoption";
    property.setAttribute("class", classfiller);
    property.setAttribute("id", "edge-filter-"+prop);
    property.text = prop;
    document.getElementById("edge-filter-"+key).appendChild(property);
  }
}

var edge_filterbox = document.createElement("div");
edge_filterbox.setAttribute("id", "edge_filtercontainer");
document.getElementById("interaction").appendChild(edge_filterbox);
document.getElementById("filterholder2").innerHTML+="<p class='filter-title'>Operator:</p>";
var e_operator = document.createElement("SELECT");
e_operator.setAttribute("id","edge_ddoperator");
e_operator.setAttribute("title","Select the operator first, this operator applies to the chose attributevalue.");
document.getElementById("filterholder2").appendChild(e_operator);

for (o =0; o < operatorlist.length; o++){
  logical = document.createElement("OPTION");
  logical.text = operatorlist[o][0];
  logical.value = operatorlist[o][1];
  document.getElementById("edge_ddoperator").appendChild(logical);    //add code to nodes-function part!
}

function preparefilter(p0, p1, p2){
  if (p0 === "node"){
    var operator = document.getElementById('ddoperator').value;
  }else{
    var operator = document.getElementById('edge_ddoperator').value;
  }
  filteroptions.push([p0, operator, p1, p2]);
  // iterate over the filteroptions and apply them in order of addition of condition(c)
  //chain filters together so that OR operator gets evaluated in the same run.
  filter.undo();
  var nodechain = {};
  var edgechain = {};
  for (var f= 0; f<filteroptions.length; f++){
    var attr = filteroptions[f][3];
    var operator = filteroptions[f][1];
    var atval = filteroptions[f][2];
    if (filteroptions[f][1]=== "or"){
      var equality = '===';
    }else{
      var equality = '!==';
    }
    if(filteroptions[f][0]==="node"){
      if(nodechain[attr+operator] == undefined){
        nodechain[attr+operator] = "";
      }
      nodechain[attr+operator] += " || n."+attr+' '+ equality+ "'"+ atval+"'";
    }else{
      if(edgechain[attr+operator] == undefined){
        edgechain[attr+operator] = "";
      }
      edgechain[attr+operator] += " || n."+attr+' '+ equality+ "'"+ atval+"'";
    }
  }

  function chainmaker(input){
    var ret ="";
    for(var key in input){
      ret += "("+input[key].slice(4, input[key].length) +") && ";
    }
    ret = ret.slice(0, ret.length-3);
    return ret;
  }

  var fullnodechain = chainmaker(nodechain);
  var fulledgechain = chainmaker(edgechain);

  if (fullnodechain !== ""){
    filter.nodesBy(function(n){
      return eval(fullnodechain);
    });
  }
  if (fulledgechain != ""){
    filter.edgesBy(function(n){
      return eval(fulledgechain);
    });
  }

  filter.apply();
}



// making handles ==> if an object is clicked, the filterin process is triggered.
// Reduction ==> Nodes and edges are parsed by same filtering method
// now using one dictionary!!
var selectors = document.getElementsByClassName("filtermain");
var a = selectors.length;
while(a--){
  document.getElementById(selectors[a].id).addEventListener("change", function(e){
    preparefilter("node", this.value, this.children[1].className.split(" ")[0]);
  });
}
var edge_selectors = document.getElementsByClassName("edge_filtermain");
a = edge_selectors.length;
while(a--){
  document.getElementById(edge_selectors[a].id).addEventListener("change", function(e){
    preparefilter("edge", this.value, this.children[1].className.split(" ")[0]);
  });
}

  //subfunction clear filtering
  var removefilter = document.createElement("INPUT");
  removefilter.setAttribute("type","button");
  removefilter.setAttribute("value","Remove all filters");
  removefilter.setAttribute("id","removefilter");
  document.getElementById("deletefilter").appendChild(removefilter);
  document.getElementById("removefilter").onclick =function()  {
    filter.undo();  //removes all filters active on the canvas.
    reset();
    filter.apply(); // updates the graph on the canvas.
};
//end of  filtering V2

// custom rightclick = create ego network.
s.bind("rightClickNode", function(e){
  // fixes the contextmenu display when you click with the right button on a node
  if (document.addEventListener) {
    document.getElementById("graph-container").addEventListener("contextmenu", function(e) {
        e.preventDefault();
    }, false);
} else {
    document.attachEvent("oncontextmenu", function() {
        window.event.returnValue = false;
    });
}
  // end of contextmenu fix.

  var center = e.data.node.id;
  if (link_board){
    shownode(center, "graph");
  }
  center_filter.undo();
  center_filter.neighborsOf(center);
  center_filter.apply();
  reset("edges");
  reset("nodes");
});
  // end of right click overwrite code.

//Feature request: Zoom in/reset/out: 8/12/17
var zoomfactor = 1.25;
var maxin = 0.3;
var maxout = 3;

var lens = s.cameras[0];
var zoomin = '<button id="zoomin"><i class="fa fa-search-plus zoomicon"></i></button>';        // DO NOT USE .fas AS RECOMMENDED BY FA5.0B!!
var zoomout = '<button id="zoomout"><i class="fa fa-search-minus zoomicon"></i></button>';
var zoomreset = '<button id="zoomzero"><i class="fa fa-search zoomicon"></i></button>';
document.getElementById("zoomcontrol").innerHTML = zoomin+zoomreset+zoomout;

document.getElementById("zoomin").addEventListener("click",function(){
  if (lens.ratio > maxin){
    lens.ratio = lens.ratio/zoomfactor;
    s.refresh();
  }
});

document.getElementById("zoomout").addEventListener("click",function(){
  if (lens.ratio < maxout){
    lens.ratio = lens.ratio*factor;
    s.refresh();
  }
});

document.getElementById("zoomzero").addEventListener("click",function(){
  if ((lens.x!==0)||(lens.y!==0)||(lens.ratio!==1)){
    lens.x = 0;
    lens.y = 0;
    lens.ratio = 1;
    s.refresh();
  }
});

var restore = document.createElement("INPUT");
restore.setAttribute("type", "button");
restore.setAttribute("value", "Reset graph");
restore.setAttribute("id", "restore");
document.getElementById("zoomcontrol").appendChild(restore);
document.getElementById("restore").onclick = function(){
  s.graph.nodes().forEach(function(node){
    node.hidden = false;
    });
  s.graph.edges().forEach(function(edge){
    edge.hidden = false;
  });
	s.refresh();
	document.getElementById("default-txt").style.display = "block";
  	document.getElementById("holdinjected").style.display = "none";
  	document.getElementById("holdinjected").innerHTML = "";     // emptying div
};

// Enable drag functionality.
sigma.plugins.dragNodes(s, s.renderers[0]);
s.refresh();

//feature request 4/6/18 ==> Search on name
var searchsuggestions = document.createElement("DIV");
searchsuggestions.setAttribute("id", "autocompleter");
searchsuggestions.setAttribute("class", "autocomplete_list");
document.getElementById("suggestions").appendChild(searchsuggestions);
var have_used = false;
function closeAllLists(){
  searchsuggestions.innerHTML = "";
  document.getElementById("autocompleter").style.visibility="hidden";
}
document.getElementById("namesearch").addEventListener("input", function namefinder(){
  searchsuggestions.innerHTML = "";
  val = document.getElementById("namesearch").value;
  val_len = val.length;
  if (val_len == 0){
    document.getElementById("autocompleter").style.visibility="hidden";
    if (have_used){
      center_filter.undo();
      center_filter.apply();
      have_used = false;
      document.getElementById("default-txt").style.display = "block";    //clears out left information pane on reset from ego to full
      document.getElementById("holdinjected").style.display = "none";
      document.getElementById("holdinjected").innerHTML = "";     // emptying div
    }
    return null;}   //exits when going from >0 to zero input
  s.graph.nodes().forEach(function(node){
    name = node.label;
    id = node.id;
    if (name.substr(0, val_len).toUpperCase() === val.toUpperCase()){
      /*create a DIV element for each matching element:*/
      b = document.createElement("DIV");
      b.setAttribute("class", "autocomplete_item");
      /*make the matching letters bold:*/
      b.innerHTML = "<strong>" + name.substr(0, val.length) + "</strong>";
      b.innerHTML += name.substr(val.length);
      b.innerHTML += " - "+id;
      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value='" + name+", "+id + "'>";
      /*execute a function when someone clicks on the item value (DIV element):*/
      b.addEventListener("click", function(e) {
        var clicked = this.getElementsByTagName("input")[0].value.split(", ");
        var clicked_name = clicked[0];
        document.getElementById('namesearch').value = clicked_name;
        var clicked_id = clicked[1];
        //hide searchbox (you have what you need)
        document.getElementById("autocompleter").style.visibility="hidden";
        /*insert the value for the autocomplete text field:*/
        //create ego network on click.
        reset("edges");
        reset("nodes");
        center_filter.undo();
        center_filter.neighborsOf(clicked_id);
        shownode(clicked_id, "graph");    //Adds node information
        center_filter.apply();
        reset("edges");
        reset("nodes");
        have_used = true;
        /*close the list of autocompleted values,
        (or any other open lists of autocompleted values:*/
        closeAllLists();
      });
      searchsuggestions.appendChild(b);
      document.getElementById("autocompleter").style.visibility="visible";
    }
    });
});
}

//Open and close node and edge filters
jQuery(document).ready(function(){
  $('.filterheader').click(function() {
      $(this).next().toggle();
      return false;
  }).next().hide();
});
