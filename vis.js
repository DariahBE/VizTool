function create_spaghetti(graph, mode) {
// end-user programming required.

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

  // Set Edgecolor same as Nodecolor? (use true or false.)
var edgecol_is_nodecol = false;         // use true or false
var edgecol = "rgba(30,78,87,0.2)";     // if you set edgecol_is_nodecol = false; this will be the default color of edges.

  // Filter ignorelist.
var ignorelist = ["id", "x", "y", "size", "color", "label"];

// link graphboard to left side information panel. (This will link clickevents between the two information panel and graph visualization.)
var link_board = true;              // true or false

  // Hides these attributes from the nodes in the onclick event:
var node_ignore = ["x", "y", "size", "color", "id", "hidden", "read_cam0:size", "read_cam0:x", "read_cam0:y", "renderer1:x", "renderer1:y", "renderer1:size", "dn_x", "dn_y", "dn_size", "dn", "fr_x", "fr_y", "fr"];

  // hides these attributes form the edges in the onclick event:
      // NOTICE ==> source and target are not used directly; they are replaced by the correlating node-labels
var edge_ignore = ["color", "size", "id", "type", "hidden", "read_cam0:size", "renderer1:size", "source", "target"];

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
var nameforsize = "your_size_key";             // In your data, what key is used to denote the size of a node? (string)


// Leave code below as is.

  //Filling Blackboard div.
document.getElementById("blackboard").innerHTML = '<div id="detail-container"> <div class="side_panels_content"> <div class="static"> <a href="https://www.kuleuven.be/kuleuven/" target="_blank"><img src="https://kuleuvencongres.be/eusea/images/kuleuven-logo-2012.png/image" alt="KUL" class="img-top"></a><a href="http://be.dariah.eu/" target="_blank"><img src="http://be.dariah.eu/sites/all/themes/dariah_be/logo.png" alt="Dariah-BE" class="img-top"></a> <p>Powered by: <a href="http://sigmajs.org/" target="_blank">sigma.js</a> </p> </div> <div class="txt"> <div id="holdinjected"> </div> <div id="default-txt"> <p id="default-msg">For more details on a given node, click it. Details appear here. </p></div></div></div></div><div id="graph-container"></div> <div id="interaction"> <div class="side_panels_content"> <div id="zoomcontrol"></div> <div class="controllers"> <div id="accordion"> <h4>Force Atlas 2 Layout <div id="snitch" title="This indicator shows you if ForceAtlas is still running. Red means that it\'s been stopped, green means that it\'s running. ForceAtlas is a continious layout algorithm and needs to be stopped explicitly"></div></h4><div><div class="FA_Options"><div id="scale_holder"><div class="display_unit"> <label for="scaling" title="ScalingRatio expands the graph, making it more sparse."><div>ScalingRatio: <input type="text" id="scaling" readonly style="border:0; background:none;"></div></label></div><div id="scaling_ratio" class="slider"></div></div><br><div id="gravity_holder"><div class="display_unit"><label for="gravity" title="Gravity attracts nodes to the center which prevents drifting nodes."><div>Gravity: <input type="text" id="gravity" readonly style="border:0; background:none;"></div></label></div><div id="gravity_factor" class="slider"></div></div><br><div id="slowdown_holder"><div class="display_unit"><label for="slowdown" title="Slowing down makes the nodes less prone to the repulsive forces from neighboring nodes. A higher value results in more stable nodes."><div>Slowdown: <input type="text" id="slowdown" readonly style="border:0; background:none;"></div></label></div><div id="slowdown_factor" class="slider"></div></div><br><div><label title="Makes the rendered clusters more tight by switching from lin-lin to lin-log(Andreas Noack). This is not recommended for small graphs.">LinLogmode:</label><div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="linlogswitch"><label class="onoffswitch-label" for="linlogswitch"></label><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></div><br><label title="Forces a compact graph by attracting distant nodes, this force can be too strong and thus results in a biased placement.">StrongGravityMode:</label><div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="heavy"><label class="onoffswitch-label" for="heavy"></label> <span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></div><br></div></div><div class="FA_Controller"><input value="run forceatlas2" id="skywalker" type="button"><input value="stop forceatlas2" id="darth_vader" type="button"></div></div>  <h4>Fruchterman-Reingold Layout</h4><div><div class="FR_options"><div id="Fiterate_holder"><div class="display_unit"> <label for="iterator" title="How many times the algorithm is expected to run before rendering. WARNING: high values tend to be more precise, but are not suitable for large networks due to performance issues."><div>Iterations: <input type="text" id="iterator" readonly style="border:0; background:none;"></div></label></div><div id="iteration_ratio" class="slider"></div></div><br><div id="Fspeed_holder"><div class="display_unit"><label for ="F_speed" title="How fast the algorithms is expected to work. A higher value will give faster results at the cost of precision."><div>Speed: <input type="text" id="F_speed" readonly style="border:0; background:none;"></div></label></div><div id="speed_Fratio" class="slider"></div></div><br><div id="Fgrav_holder"><div class="display_unit"><label for ="F_gravity" title="This will attract all nodes to the center to avoid dispersion of unconnected nodes."><div>Gravity: <input type="text" id="F_gravity" readonly style="border:0; background:none;"></div></label></div><div id="gravity_Fratio" class="slider"></div></div><br></div><div id="FR_controller"></div></div></div><!-- hods the javascript buttons. --> <!-- no code here --> </div> <div id="filterholder"> <!-- no code here --> </div> <!--  <div id=viserion></div> --> <div class="footer"> <p>If Trismegistos helped you, share and <a href="http://www.trismegistos.org/about_how_to_cite" target="_blank">cite</a> us.</p> <div id="share"></div> <!-- JSOC Injection --> </div></div></div>';

  //end of filling blackboard.
  // JQUERY UI SLiders and accordion
  $(function() {
  $("#accordion").accordion({
    collapsible: true,
    active: false
  });
} );

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

    $("#linlogswitch").click(function(){the_empire_strikes_back()});
    $("#heavy").click(function(){the_empire_strikes_back()});

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
  yoda("strong_in_this_one", grav, scal, slow, linlog, heavy);
};

//ForceAtlas: Implicit builder (only active if use_the_force = true)
function the_empire_strikes_back() {
  if (use_the_force){
  yoda("stop_him_we_must");

  var grav = $("#gravity_factor").slider("option", "value");
  var scal = $("#scaling_ratio").slider("option", "value");
  var slow = $("#slowdown_factor").slider("option", "value");
  var linlog = document.getElementById("linlogswitch").checked;
  var heavy = document.getElementById("heavy").checked;

  yoda("strong_in_this_one", grav, scal, slow, linlog, heavy);
  }
};

document.getElementById("darth_vader").onclick = function(){
    use_the_force = false;
    yoda("stop_him_we_must");
};

  //creating buttons on screen.
var allow_fruchterman = false;
var fruchterman_start= document.createElement("INPUT");
fruchterman_start.setAttribute("type", "button");
fruchterman_start.setAttribute("value", "run fruchterman");
fruchterman_start.setAttribute("id", "milleniumfalcon");
if (graph.nodes.length > max_interactive_density){
  fruchterman_start.setAttribute("disabled", "disabled");
  fruchterman_start.setAttribute("title","Disabled due to too large network.");
}
document.getElementById("FR_controller").appendChild(fruchterman_start);
document.getElementById("milleniumfalcon").onclick = function(){
    allow_fruchterman = true;
    fruchterman_func()
};

var noverlap = document.createElement("INPUT");
noverlap.setAttribute("type", "button");
noverlap.setAttribute("value", "run noverlap");
noverlap.setAttribute("id", "shepherd");
if (graph.nodes.length > max_interactive_density){
  noverlap.setAttribute("disabled", "disabled");
  noverlap.setAttribute("title","Disabled due to too large network.");
}
document.getElementsByClassName("controllers")[0].appendChild(noverlap);
document.getElementById("shepherd").onclick = function(){
    mass_effect()
};

var savesvg = document.createElement("INPUT");
savesvg.setAttribute("type", "button");
savesvg.setAttribute("value", "export as svg");
savesvg.setAttribute("id", "export");
document.getElementsByClassName("controllers")[0].appendChild(savesvg);

var savejpg = document.createElement("INPUT");
savejpg.setAttribute("type","button");
savejpg.setAttribute("value", "export as jpg");
savejpg.setAttribute("id","exportjpg");
document.getElementsByClassName("controllers")[0].appendChild(savejpg);

var savepng = document.createElement("INPUT");
savepng.setAttribute("type","button");
savepng.setAttribute("value", "export as png");
savepng.setAttribute("id","exportpng");
document.getElementsByClassName("controllers")[0].appendChild(savepng);

var restore = document.createElement("INPUT");
restore.setAttribute("type", "button");
restore.setAttribute("value", "restore graph");
restore.setAttribute("id", "restore");
document.getElementsByClassName("controllers")[0].appendChild(restore);
document.getElementById("restore").onclick = function(){
  s.graph.nodes().forEach(function(node){
    node.hidden = false;
    });
  s.graph.edges().forEach(function(edge){
    edge.hidden = false;
  });
    s.refresh();
};
// end of Buttons.

// initiating graph
  var g = {
  nodes:[],
  edges:[]
}

// setting boundaries on node- and edgesize by total amount of nodes.
var totalnodes = graph.nodes.length;
var nodesize = 10;
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
  nodesize = nodesize*2.25
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
  };
function determinesize(i){
  if (!fixedsize){
    return 1;
  } else {
    return graph.nodes[i][nameforsize];
  }
}
// Customize this code to push components from your data to g.nodes.
for (var i = 0; i < graph.nodes.length; i++){
    var id = graph.nodes[i]["id"];
    var label = graph.nodes[i]["label"];
    var country = graph.nodes[i]["tpl"];
    var nationality = graph.nodes[i]["ntl"];
    var typology = graph.nodes[i]["tpl"];
    var xpos = positioner("x",i);
    var ypos = positioner("y",i);
    var size =  determinesize(i);
    var color = determinecolor(typology);        //this re-uses the typology variable to assign colors. You can use other variables as well.
    var xside = xside +1;
    if ((xside >= side) && (!positions_are_known)){
      xside = 1;
      yside = yside+1;
    }
    g.nodes.push({
      id: id,
      label: label,
      nationality: nationality,
      typology: typology,
      x: xpos,
      y: ypos,
      size: size,                 // you can force this to use a 'null' value if needed,-; but then disable the sigma.plugins.relativeSize functionality later in the script
      color: color,
    })
  }

function edgecolor_assigner(state, alt){
  if (state){
    return null;
  }else{
    return alt;
  }
};
// Customize this code to push components from your data to g.edges.
var edgescol = edgecolor_assigner(edgecol_is_nodecol,edgecol);
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
    maxEdgeSize: edgesize,
    autoRescale: true,
    autoResize: true,
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
  };
if (the_force === "strong_in_this_one"){
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
    barnesHutTheta:1}
  s.startForceAtlas2(fa_options);
}else{
    document.getElementById("snitch").style.backgroundColor="red";
  s.killForceAtlas2();
}
};

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
    }
      sigma.layouts.fruchtermanReingold.start(s, fruchtermanconfig);
    }
  };

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
  for (var ed = 0; ed <data.edges.length; ed++){
    if(g.edges[ed].id === edgeid){
      document.getElementById("holdinjected").innerHTML = "";     // emptying div
      document.getElementById("holdinjected").innerHTML = "<h2>Edge info</h2>";
      var edge_src = g.edges[ed].source;
      var edge_trg = g.edges[ed].target;
      var edge_src_label = lookup_id(edge_src);
      var edge_trg_label = lookup_id(edge_trg);
      var inject_edge_data_only = "<p>Source: <span id='"+edge_src+"' class='hotlink_node'>"+edge_src_label+"</span></p><p>Target: <span id='"+edge_trg+"' class='hotlink_node'>"+edge_trg_label+"</span></p>";
      var object_keys_edge = Object.keys(g.edges[ed]);
      for (var ek = 0; ek <object_keys_edge.length; ek++){
        if(edge_ignore.indexOf(object_keys_edge[ek])<0){
          inject_edge_data_only += "<p>"+object_keys_edge[ek]+": "+g.edges[ed][object_keys_edge[ek]]+"</p>";
        }
      };
      document.getElementById("holdinjected").innerHTML +=inject_edge_data_only;
      break
    }
  }
};
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
      };
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
      };
      for (var inrel = 0; inrel <g.edges.length; inrel ++){
        if ( g.edges[inrel].target === nodeid){
          temparr.push(g.edges[inrel].source);
          temparr.push(g.edges[inrel].id);
          intargets.push(temparr)};
          temparr = [];
          }
      if (link_board &&(source != "graph")){
        s.graph.nodes().forEach(function(n){
          n.hidden=true;
        })
        s.graph.edges().forEach(function(p){
          if ((p.target===nodeid) || (p.source===nodeid)){
            p.hidden=false;
            s.graph.nodes(p.target).hidden=false;
            s.graph.nodes(p.source).hidden=false;
          }else{
            p.hidden=true;
          }});
        s.refresh();
      };
      // assigning names(label) to outbound relations.
   for (var otrg = 0; otrg <outtargets.length; otrg++){
     s.graph.nodes().forEach(function(n){
       if(n.id === outtargets[otrg][0]){
         outboundrelations = outboundrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+outtargets[otrg][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"'title='click for more information on this node'>N?</span> </p>";
       }
     })
   };

   for (var intrg = 0; intrg <intargets.length; intrg++){
     s.graph.nodes().forEach(function(n){
       if(n.id === intargets[intrg][0]){
         inboundrelations = inboundrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+intargets[intrg][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"' title='click for more information on this node'>N?</span> </p>";
       }
     })
   };
   document.getElementById("holdinjected").innerHTML=inject_node_data + "<h3>Outgoing relations: "+outtargets.length+"</h3>"+ outboundrelations + "<h3>Incoming relations: "+intargets.length+"</h3>"+ inboundrelations;
   document.getElementById("default-txt").style.visibility = "hidden";
   document.getElementById("holdinjected").style.visibility = "visible";
      break
    }
  }

};

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
  };
  var outtargets = [];
  var intargets = [];
  var temparr=[];
      // detecting outbound relations.
  for (var outrel = 0; outrel <graph.edges.length; outrel ++){
    if ( graph.edges[outrel].source === ego){
      temparr.push(graph.edges[outrel].target);
      temparr.push(graph.edges[outrel].id);
      outtargets.push(temparr);}
      temparr=[];
  };
      // detecting incoming relations.
  for (var inrel = 0; inrel <graph.edges.length; inrel ++){
    if ( graph.edges[inrel].target === ego){
      temparr.push(graph.edges[inrel].source);
      temparr.push(graph.edges[inrel].id);
      intargets.push(temparr)};
      temparr = [];
  };
     // assigning names(label) to outbound relations.
  for (var otrg = 0; otrg <outtargets.length; otrg++){
    s.graph.nodes().forEach(function(n){
      if(n.id === outtargets[otrg][0]){
        outboundrelations = outboundrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+outtargets[otrg][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"'title='click for more information on this node'>N?</span> </p>";
      }
    })
  };

  for (var intrg = 0; intrg <intargets.length; intrg++){
    s.graph.nodes().forEach(function(n){
      if(n.id === intargets[intrg][0]){
        inboundrelations = inboundrelations + "<p>"+n.label+". <span class='hotlink_edge' id='"+intargets[intrg][1]+"' title='click for more information on this relationship'>E?</span> / <span class='hotlink_node' id='"+n.id+"' title='click for more information on this node'>N?</span> </p>";
      }
    })
  };
  document.getElementById("holdinjected").innerHTML=inject_node_data + "<h3>Outgoing relations: "+outtargets.length+"</h3>"+ outboundrelations + "<h3>Incoming relations: "+intargets.length+"</h3>"+ inboundrelations;
  document.getElementById("default-txt").style.visibility = "hidden";
  document.getElementById("holdinjected").style.visibility = "visible";
});

var send_id = 0;
$(document).on("click", ".hotlink_edge", function(){
  send_id = this.getAttribute("id")
  showrelation(send_id);
});

$(document).on("click", ".hotlink_node", function(){
  send_id = this.getAttribute("id")
  shownode(send_id);
});
// custom edgeclick

function lookup_id(value){
  for (var lookup = 0; lookup < graph.nodes.length; lookup++){
    if (graph.nodes[lookup].id === value){
      return(graph.nodes[lookup].label);
    }
  }
};

s.bind("clickEdge", function(e) {
  // numerical values for source and target are replaced by the node labels!
  // If the numerical values are URI's, then you can use them to make a hyperlink to that unique page, using the label as clickable text.
  var inject_edge_data = "<h2>Edge info</h2> ";
  var object_keys_edge = Object.keys(e.data.edge);
  var edge_src = e.data.edge.source;
  var edge_trg = e.data.edge.target;
  var edge_src_label = lookup_id(edge_src);
  var edge_trg_label = lookup_id(edge_trg);
  inject_edge_data += "<p>Source: <span id='"+edge_src+"' class='hotlink_node'>"+edge_src_label+"</span></p><p>Target: <span id='"+edge_trg+"' class='hotlink_node'>"+edge_trg_label+"</span></p>";
  for (var ek = 0; ek <object_keys_edge.length; ek++){
    if(edge_ignore.indexOf(object_keys_edge[ek])<0){
      inject_edge_data += "<p>"+object_keys_edge[ek]+": "+e.data.edge[object_keys_edge[ek]]+"</p>";
    }
  };
  document.getElementById("holdinjected").innerHTML = inject_edge_data;
  document.getElementById("default-txt").style.visibility = "hidden";
  document.getElementById("holdinjected").style.visibility = "visible";
})
// custom stageclick.
s.bind("clickStage", function(){
  document.getElementById("default-txt").style.visibility = "visible";
  document.getElementById("holdinjected").style.visibility = "hidden";
  document.getElementById("holdinjected").innerHTML = "";     // emptying div
})

// custom righclickstage
s.bind("rightClickStage", function(){
  filter.undo();
  filter.apply();
})


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
};
  // end of contextmenu fix.

  var center = e.data.node.id;
  if (link_board){
    shownode(center, "graph");
  }
  s.graph.nodes().forEach(function(n){
    n.hidden=true;
  })
  s.graph.edges().forEach(function(p){
    if ((p.target===center) || (p.source===center)){
      p.hidden=false;
      s.graph.nodes(p.target).hidden=false;
      s.graph.nodes(p.source).hidden=false;
    }else{
      p.hidden=true;
    }});
  s.refresh();
});
  // end of right click overwrite code.

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

//Sigma filtering
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
        single.push(input[a])
      }
    }
    return single;
};

for (attribute in attributenames){
  s.graph.nodes().forEach(function(node) {
    attributenames[attribute].push(node[attribute]);
  });
  attributenames[attribute]= singularity(attributenames[attribute]);
}

var filterbox = document.createElement("div");
filterbox.setAttribute("id", "filtercontainer");
document.getElementById("interaction").appendChild(filterbox);
document.getElementById("filterholder").innerHTML+="Operator: ";
var operator = document.createElement("SELECT");
operator.setAttribute("id","ddoperator");
operator.setAttribute("title","Select the operator first, this operator applies to the chose attributevalue.");
document.getElementById("filterholder").appendChild(operator);

var operatorlist = [["OR","or"], ["NOT","not"]];

for (o =0; o < operatorlist.length; o++){
  var logical = document.createElement("OPTION");
  logical.text = operatorlist[o][0];
  logical.value = operatorlist[o][1];
  document.getElementById("ddoperator").appendChild(logical);
}

for (key in attributenames){
  var option = document.createElement("SELECT");
  option.setAttribute("id","node-filter-"+key);
  option.setAttribute("class","filtermain");
  option.setAttribute("title", "Click an option to apply the operator to, the selected option for '"+key+"' gets pushed as a filter when it is clicked");
  document.getElementById("filterholder").innerHTML+="<br><span>"+key+": </span>";
  document.getElementById("filterholder").appendChild(option);
  var defaulter = document.createElement("OPTION");
  defaulter.text = "select option";
  defaulter.setAttribute("selected", true);
  defaulter.setAttribute("disabled", true);
  document.getElementById("node-filter-"+key).appendChild(defaulter);
  for (x in attributenames[key]){
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

function runfilter(specsheet){
  filter.undo();
  var orstring = "";
  var notstring = "";
  for(key in specsheet){
    for(conditional in specsheet[key]){
      if (conditional === "not"){
        var notstring = notstring +" && n['"+key+"']!==";
        var notstring = notstring + specsheet[key][conditional].join(" && n['"+key+"'] !== ");
        if(notstring[1]==="&"){
          var notstring = notstring.slice(3, notstring.length)};
          filter.nodesBy(function(n){
            return eval(notstring);
          })
          filter.apply();
      }
      if (conditional ==="or"){
        var orstring = orstring + " && n['"+key+"']===";
        var orstring = orstring + specsheet[key][conditional].join(" || n['"+key+"'] === ");
        if(orstring[1]==="&"){
          var orstring = orstring.slice(3, orstring.length)};
          var orstring = "("+orstring+")";
          filter.nodesBy(function(n){
            return eval(orstring);
          })
          filter.apply()
      }
    };
  }
};

var filteroptions = {};
function preparefilter(param){
  var attribute_scope = param.className.split(" ")[0];
  var attribute_value = param.value;
  var attribute_id = param.id;
  var operatorholder = document.getElementById("ddoperator");
  var operator = operatorholder[operatorholder.selectedIndex].value;
  if(!(attribute_scope in filteroptions)){
    filteroptions[attribute_scope] = {};
  }
  if(!(operator in filteroptions[attribute_scope])){
    filteroptions[attribute_scope][operator] = ["'"+attribute_value+"'"];
  }else{
    filteroptions[attribute_scope][operator].push("'"+attribute_value+"'");
  }
  runfilter(filteroptions);
};

var selectors = document.getElementsByClassName("attributeoption");
var a = selectors.length;
while (a--){
  selectors[a].addEventListener("click", function() {preparefilter(this)});
}

  //subfunction clear filtering
  var removefilter = document.createElement("INPUT");
  removefilter.setAttribute("type","button");
  removefilter.setAttribute("value","remove filters");
  removefilter.setAttribute("id","removefilter");
  document.getElementById("filterholder").insertAdjacentHTML("beforeend","<br><br>");
  document.getElementById("filterholder").appendChild(removefilter);
  document.getElementById("removefilter").onclick =function() {
    filter.undo();  //removes all filters active on the canvas.
    filteroptions = {};     // Emptying the filteroptions-object!!!
    filter.apply(); // updates the graph on the canvas.
}
//end of filtering

//Feature request: Zoom in/reset/out: 8/12/17
var factor = 1.25;
var maxin = 0.3;
var maxout = 3;

var lens = s.cameras[0];
var zoomin = '<button id="zoomin"><i class="fa fa-search-plus zoomicon"></i></button>';        // DO NOT USE .fas AS RECOMMENDED BY FA5.0B!!
var zoomout = '<button id="zoomout"><i class="fa fa-search-minus zoomicon"></i></button>';
var zoomreset = '<button id="zoomzero"><i class="fa fa-search zoomicon"></i></button>';
document.getElementById("zoomcontrol").innerHTML = "<span>"+zoomin+zoomreset+zoomout+"</span>";

document.getElementById("zoomin").addEventListener("click",function(){
  if (lens.ratio > maxin){
    lens.ratio = lens.ratio/factor;
    s.refresh();
  }
})

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


// Enable drag functionality.
sigma.plugins.dragNodes(s, s.renderers[0]);
s.refresh();
};
