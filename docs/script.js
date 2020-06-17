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

  // Array of colors
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
  .attr('class', 'tile') // required for the fcc test
  .on('mouseover', function(d) { // tooltip
    console.log("mouseover");
    tooltip
        .style('visibility', 'visible')
    // id is required for fcc test
        .html('<p>Value: ' + d.data.value + '</p>')
    // required for fcc test
        .attr('data-value', d.data.value );
  })
  .on('mousemove', function(d) {
    tooltip
        .style('top', d3.event.pageY - 20 + 'px')
        .style('left', d3.event.pageX + 10 + 'px');
  })
  .on('mouseout', function(d) {
    tooltip.style('visibility', 'hidden');
  });

  // Tooltip
  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip'); // required for fcc test

  // legend

  // Define legend area
  const legendSvg = d3
    .select('#legend')
    .append('svg')
    .attr('width', 1000)
    .attr('height', 150);

  // Display legend colors
  legendSvg
    .selectAll('rect')
    .data(colors)
    .enter()
    .append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', (d, i) => colors[i])
    .attr('x', (d, i) => (i % 5) * 100)
    .attr('y', (d, i) => Math.floor(i / 5) * 30)
    .attr('class', 'legend-item'); // required for the fcc test

  // Display legend labels
  legendSvg
    .selectAll('text')
    .data(platforms)
    .enter()
    .append('text')
    .text((d) => d)
    .attr('width', 50)
    .attr('height', 20)
    .attr('x', (d, i) => (i % 5) * 100 + 25)
    .attr('y', (d, i) => Math.floor(i / 5) * 30 + 15);

  // Configure axes
  const legendAxis = d3.axisBottom(legendScale).tickFormat(d3.format('.1'));

}
