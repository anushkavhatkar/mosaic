const colorPalette = [
    '#2FB6FB', '#ADB52F', '#C1AE2F', '#FB85A3', '#ED9661', 
    '#FB7FBC', '#2FC99E', '#F37FE5', '#FEFC8E', '#FF6EFB',
    '#AF7ED9', '#F0F0FF', '#FFCCFF', '#FFB6C2', '#489493',
    '#DEC105', '#57CA2C', '#91B2EB', '#EA4A28', '#EBDA5F',
    '#5DC3D6', '#C85CD9', '#EA6535', '#E7B247', '#DDD79C', 
    '#AAE56E', '#E8B3D', '#C9FFC8', '#0142FE', '#FCEE55', 
    '#C287E1', '#1988EF', '#FC8155', '#FF501B', '#FBFF53',
    '#DEBCF8', '#8F5236', '#AED3FF', '#00894E'
];

// Function to generate random intensity between 0.3 and 1
const randomIntensity = () => Math.random() * 0.7 + 0.3;

const relationships = [
    { id: 1, type: "Family", memory: "Sunday dinners" },
    { id: 2, type: "Romance", memory: "First kiss" },
    { id: 3, type: "Friendship", memory: "Road trips" },
    { id: 4, type: "Family", memory: "Holiday traditions" },
    { id: 5, type: "Romance", memory: "Summer love" },
    { id: 6, type: "Friendship", memory: "Late night talks" },
    { id: 7, type: "Mentor", memory: "Life lessons" },
    { id: 8, type: "Family", memory: "Growing up" },
    { id: 9, type: "Romance", memory: "Dancing in rain" }
].map(rel => ({
    ...rel,
    intensity: randomIntensity(),
    color: colorPalette[Math.floor(Math.random() * colorPalette.length)]
}));

const width = 800;
const height = 500;
const padding = 60;

const svg = d3.select("#mosaic")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

let simulation = createSimulation(relationships);
let activeCircle = null;

function createSimulation(nodes) {
    return d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => Math.sqrt(d.intensity) * 140));
}

function updateVisualization(filteredData) {
    svg.selectAll(".mosaic-tile").remove();
    activeCircle = null;
    tooltip.style("opacity", 0);

    simulation.stop();
    simulation = createSimulation(filteredData);

    const tiles = svg.selectAll(".mosaic-tile")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "mosaic-tile pulsing")
        .attr("r", d => Math.sqrt(d.intensity) * 100)
        .style("fill", d => d.color)
        .style("opacity", d => d.intensity)
        .on("click", function(event, d) {
            event.stopPropagation();
            
            if (activeCircle === this) {
                d3.select(this)
                    .classed("active", false)
                    .classed("pulsing", true)
                    .style("stroke", "none");
                tooltip.transition()
                    .duration(1500)
                    .style("opacity", 0);
                activeCircle = null;
                return;
            }

            if (activeCircle) {
                d3.select(activeCircle)
                    .classed("active", false)
                    .classed("pulsing", true)
                    .style("stroke", "none");
            }

            activeCircle = this;
            d3.select(this)
                .classed("active", true)
                .classed("pulsing", false)
                .style("stroke", "#fff")
                .style("stroke-width", "4px");

            tooltip.transition()
                .duration(1500)
                .style("opacity", .9);
                
            tooltip.html(`
                <strong>${d.type}</strong><br/>
                Memory: ${d.memory}
            `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 40) + "px");
        });

    d3.select("body").on("click", () => {
        if (activeCircle) {
            d3.select(activeCircle)
                .classed("active", false)
                .classed("pulsing", true)
                .style("stroke", "none");
            tooltip.transition()
                .duration(1500)
                .style("opacity", 0);
            activeCircle = null;
        }
    });

    function updateForces() {
        simulation.force("charge")
            .strength(300 + Math.random() * 80);
        
        simulation.force("center")
            .x(width/2 + Math.random() * 40 - 20)
            .y(height/2 + Math.random() * 40 - 20);
        
        simulation.alpha(0.2).restart();
    }

    simulation.on("tick", () => {
        tiles
            .attr("cx", d => {
                return d.x = Math.max(padding + d.intensity * 120, 
                    Math.min(width - padding - d.intensity * 120, d.x));
            })
            .attr("cy", d => {
                return d.y = Math.max(padding + d.intensity * 120, 
                    Math.min(height - padding - d.intensity * 120, d.y));
            });
    });

    setInterval(updateForces, 5000);
}

updateVisualization(relationships);

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(btn => 
            btn.classList.remove('active'));
        this.classList.add('active');

        const filterType = this.dataset.type;
        const filteredData = filterType === 'all' 
            ? relationships
            : relationships.filter(r => r.type === filterType);

        updateVisualization(filteredData);
    });
});