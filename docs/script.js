const dataUrl =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

getDataset();

// Retrieve the dataset
function getDataset() {
  // Instanciate XMLHttpRequest Object
  req = new XMLHttpRequest();
  // Initialize GET request
  req.open('GET', dataUrl, true);
  // Send the request
  req.send();
  // onload event handler
  req.onload = function() {
    // Parse the returned JSON string to JavaScript object
    json = JSON.parse(req.responseText);
    // use the value of "data" only
    const dataset = json;

    drawChart(dataset);
  };
}

// Draw chart
function drawChart(dataset) {
  // Width and height of the svg area
  const w = 1000;
  const h = 500;
  const padding = 70;

  // Platforms
  const platforms = dataset['children'].map((child) => {
    return child.name;
  });
  console.log(platforms);
  console.log(platforms.length);

  const colors = platforms.map((platform, i) => {
    let t = i / platforms.length;
    return d3.interpolateTurbo(t);
  });

  // 描画用のデータ変換
  root = d3.hierarchy(dataset);
  root
    .sum(function(d) { return d.value; })
    .sort(function(a, b) { return b.value - a.value; });

  let treemap = d3.treemap()
    .size([w, h])
    .padding(1);

  // d3.treemap()で呼び出した関数にrootを引数として設定すると、x0, y0, x1, y1がrootに付与される
  treemap(root);

  // Define chart area
  const svg = d3
  .select('#graph')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

  // Plot data
  svg
  .selectAll('rect')
  .data(root.leaves()) // root.leavs() returns the array of leaf nodes in traversal order
  .enter()
  .append('rect')
  .attr('width', (d) => { return d.x1 - d.x0 })
  .attr('height', (d) => { return d.y1 - d.y0 })
  .attr('transform', (d) => { return 'translate(' + d.x0 + ',' + d.y0 + ')' })
  .attr('fill', (d) => {
    return colors[platforms.indexOf(d.data.category)]; // you need .data to access original json attributes
  })
  .attr('data-name', (d) => d.data.name )
  .attr('data-category', (d) => d.data.category )
  .attr('data-value', (d) => d.data.value )
  .attr('class', 'tile'); // required for the fcc test
}
