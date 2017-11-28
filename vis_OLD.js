function create_spaghetti(graph) {

// initiating g object.

var g = {
  nodes:[],
  edges:[]
}

  colors = [
      '#617db4',
      '#668f3c',
      '#c6583e',
      '#b956af'
    ];
 sigma.utils.pkg('sigma.canvas.nodes');
 sigma.canvas.nodes.border = function(node, context, settings) {
    var prefix = settings('prefix') || '';



    context.beginPath();
    context.arc(
  node[prefix + 'x']+15,
  node[prefix + 'y'],
  node[prefix + 'size']-2,
  0,
  Math.PI * 2,
  true
);

    context.strokeStyle = node.color || settings('defaultNodeColor');
    //get the data from the group
    //var data = d3.select(this).data();
    context.stroke();
    //context.fill();
    context.font = "10px Arial";
    context.fillStyle = "black";
    context.strokeStyle = "black";
    //write the text in the context
    context.fillText(10,node[prefix + 'x']+15+ 10,  node[prefix + 'size']-2-15);


    context.fillStyle = node.color || settings('defaultNodeColor');
    context.beginPath();
    context.arc(
  node[prefix + 'x'],
  node[prefix + 'y'],
  node[prefix + 'size'],
  0,
  Math.PI * 2,
  true
);
   context.closePath();
   context.fill();
  };

var side = parseInt(Math.sqrt(graph.nodes.length)+1);
var yside = 1;
var xside = 1;

for (var i = 0; i < graph.nodes.length; i++){
  var id = graph.nodes[i]['id'];
  var label = graph.nodes[i]['label'];
  var country = graph.nodes[i]["color"];
  var areat_t = graph.nodes[i]["older_x"];
  var code = graph.nodes[i]["size"];
  var xpos = xside;
  var ypos = yside;
  var size =  graph.nodes[i]["size"];
  var color = graph.nodes[i]["color"];
  var xside = xside +1;
  if (xside == side){
    xside = 1;
    yside = yside+1;
  }
  g.nodes.push({
    id: id,
    label: label,
    country: areat_t,
    area_t: graph.nodes[i]["older_x"],
    code: code,
    x: xpos,
    y: ypos,
    size: size,
    //color: colors[Math.floor(Math.random() * colors.length)]
    color: color,
  })
}

for (var i = 0; i < graph.edges.length; i++)
  g.edges.push({
    id: graph.edges[i]['id'],
    source: graph.edges[i]['source'],
    target: graph.edges[i]['target'],
    label: "test",
    size: 500,
    type:'line',
  });

var s = new sigma({graph:g});
var cam = s.addCamera();

console.log(g);

s.addRenderer({
  container: document.getElementById('graph-container'),
  type: 'canvas',
  camera: cam,
  settings: {
    edgeLabelSize: 'proportional',
    minNodeSize: 1,
    maxNodeSize: 10,
    minEdgeSize: 0.1,
    maxEdgeSize: 2,
    enableEdgeHovering: true,
    edgeHoverSizeRatio: 2,
    //defaultNodeType: 'border',
    defaultNodeColor:"#fff",
    mouseEnabled: true,
    touchEnabled: true
  }
});

console.log(s);
/*
s.addRenderer({
  container: document.getElementById('viserion'),
  type: 'canvas',
  camera: cam,
  settings: {
    edgeLabelSize: 'relative',
    minNodeSize: 0.5,
    maxNodeSize: 5,
    minEdgeSize: 0.05,
    maxEdgeSize: 1,
    enableEdgeHovering: false,
    edgeHoverSizeRatio: 1,
    defaultNodeColor:"#fff",
    mouseEnabled: false,
    touchEnabled: false,
    drawLabels: false,
    drawEdgeLabels: false,
  }
});
*/


// Enables Force Atlas on Request.
function yoda(the_force) {
//s.startForceAtlas2({worker: true, barnesHutOptimize: false/*, linLogMode:false, outboundAttractionDistribution:true, adjustSize:true, edgeWeightInfluences:1, barnesHutTheta:1*/});
if (the_force === "strong_in_this_one"){
  s.startForceAtlas2({worker: true, barnesHutOptimize: false, linLogMode:false, outboundAttractionDistribution:true, adjustSize:true, edgeWeightInfluences:1, barnesHutTheta:1});
}else{
  s.killForceAtlas2();
}
};

function mass_effect(andromeda) {
  var config = {
    nodeMargin: 3.0,
    scaleNodes: 2,
    gridSize: 100,
    easing: true,
    maxIterations: 50
  };
  if (andromeda ==='launch'){
    console.log("noverlap");
    s.startNoverlap(config);
  }
}



// custom code (show node information)
s.bind("clickNode", function (e) {
  console.log("test nodeclick");
  console.log(e.data.node.country, e.data.node.label, e.data.node.area_t, e.data.node.code);
  document.getElementById("holdinjected").innerHTML = "<h2>Node info</h2> <p>Country: "+ e.data.node.country + "</p> <p>Name: "+e.data.node.label+"</p> <p>Area: "+e.data.node.area_t+"</p><p>Code: "+e.data.node.code+"</p>";
  document.getElementById("default-txt").style.visibility = "hidden";
  document.getElementById("holdinjected").style.visibility = "visible";
});

// custom edgeclick
s.bind("overEdge", function(e) {
  console.log("test edgeclick");
  document.getElementById("holdinjected").innerHTML = "<h2>Edge info</h2> <p>Departure: <a href ='https://www.google.be/search?q="+e.data.edge.source+"' target='_blank'>"+ e.data.edge.source + "</a></p> <p>Destination: "+ e.data.edge.target +"</p> <p>Distance: "+e.data.edge.distance+"</p><p>Airline: "+e.data.edge.airlines+"</p><p>Fare: "+e.data.edge.fare+"</p>";
  document.getElementById("default-txt").style.visibility = "hidden";
  document.getElementById("holdinjected").style.visibility = "visible";
})

// custom backgroundclick.
s.bind("clickStage", function(){
  document.getElementById("default-txt").style.visibility = "visible";
  document.getElementById("holdinjected").style.visibility = "hidden";
  document.getElementById("holdinjected").innerHTML = "";     // emptying div
})

// Enable drag functionality.
sigma.plugins.dragNodes(s, s.renderers[0]);




//creating buttons on screen.
var forceatlas_start = document.createElement("INPUT");
forceatlas_start.setAttribute("type", "button");
forceatlas_start.setAttribute("value", "run forceatlas2");
forceatlas_start.setAttribute("id", "skywalker");
document.getElementsByClassName("controllers")[0].appendChild(forceatlas_start);
document.getElementById("skywalker").onclick = function(){
    yoda("strong_in_this_one")
};
var forceatlas_stop = document.createElement("INPUT");
forceatlas_stop.setAttribute("type", "button");
forceatlas_stop.setAttribute("value", "stop forceatlas2");
forceatlas_stop.setAttribute("id", "darth_vader");
document.getElementsByClassName("controllers")[0].appendChild(forceatlas_stop);
document.getElementById("darth_vader").onclick = function(){
    yoda("stop_him_we_must")
};

var noverlap = document.createElement("INPUT");
noverlap.setAttribute("type", "button");
noverlap.setAttribute("value", "run noverlap");
noverlap.setAttribute("id", "shepherd");
document.getElementsByClassName("controllers")[0].appendChild(noverlap);
document.getElementById("shepherd").onclick = function(){
    mass_effect("launch")
};
s.refresh();

}
