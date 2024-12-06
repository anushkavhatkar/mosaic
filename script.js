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

// hard coded data
const relationships = [
    { id: 1, name: "Bee", type: "Friendship", intensity: 0.8, memory: "Forever & always chalant" },
    { id: 2, name: "Anonymous", type: "Romance", intensity: .4, memory: "First everything" },
    { id: 3, name: "Mads", type: "Friendship", intensity: 0.6, memory: "Making home-made food" },
    { id: 4, name: "Dad", type: "Family", intensity: 1, memory: "Be the bigger person, always" },
    { id: 5, name: "Anonymous", type: "Romance", intensity: .9, memory: "Learning how to love & be loved"},
    { id: 6, name: "Kush", type: "Friendship", intensity: 0.65, memory: "Take pride in your roots & cultural heritage" },
    { id: 7, name: "Joe", type: "Mentor", intensity: 0.5, memory: "Put work out there and see what happens" },
    { id: 8, name: "Sarah", type: "Family", intensity: 1, memory: "Never grow up" },
    { id: 9, name: "Keshav", type: "Friendship", intensity: 0.55, memory: "Put yourself out there, why wouldn't people love you" },
    { id: 10, name: "Mads", type: "Friendship", intensity: 0.9, memory: "Be the good you want to see in people" },
    { id: 11, name: "Bee", type: "Friendship", intensity: 0.8, memory: "You've gotta go whole heart" },
    { id: 12, name: "Anonymous", type: "Friendship", intensity: 0.3, memory: "It's okay to outgrow people sometimes" },
    { id: 13, name: "Rishita", type: "Friendship", intensity: 0.66, memory: "Work hard, party harder, sleep hardest" },
    { id: 14, name: "Bee", type: "Friendship", intensity: 0.8, memory: "Be overwhelmed with gratitude instead of guilt" },
    { id: 15, name: "Aaji", type: "Family", intensity: .7, memory: "Making Diwali faraal" },
    { id: 15, name: "Ajoba", type: "Family", intensity: .5, memory: "Education is everything" },
    { id: 16, name: "Dad", type: "Family", intensity: 1, memory: "Don't forget to leave the world better than you found it" },
    { id: 17, name: "Mom", type: "Family", intensity: .5, memory: "Age is really just a number" },
    { id: 18, name: "Mom", type: "Family", intensity: .5, memory: "Age is really just a number" },
    { id: 19, name: "Sid", type: "Friendship", intensity: .4, memory: "There is so much beauty in stepping out of your comfort zone" },
    { id: 20, name: "Sid", type: "Friendship", intensity: .3, memory: "All of your artist recommendations" },
    { id: 21, name: "Anonymous", type: "Friendship", intensity: .2, memory: "All kinds of friendships are important" },
    { id: 22, name: "Sabrina", type: "Mentor", intensity: .3, memory: "A beautiful collection of letters, not a collection of beautiful letters" },
    { id: 23, name: "Mom", type: "Family", intensity: 1, memory: "My love for design is really thanks to you" },
    { id: 24, name: "Dad", type: "Family", intensity: .75, memory: "My love for tech is really thanks to you" },
    { id: 25, name: "Anonymous", type: "Mentor", intensity: .75, memory: "For believing in me at my lowest low" },
    { id: 26, name: "Anonymous", type: "Romance", intensity: .3, memory: "Margharitas"},
    { id: 27, name: "Shaurya", type: "Friendship", intensity: .2, memory: "Secondhand obsessions"},
    { id: 28, name: "Mads", type: "Friendship", intensity: 0.4, memory: "Love was inside you this entire time, actually" },
    { id: 29, name: "Sarah", type: "Family", intensity: 0.55, memory: "The wrong people might leave the party, but the right people will join the dance" },
    { id: 30, name: "Zahra", type: "Friendship", intensity: 0.15, memory: "Location spoofing" },
    { id: 31, name: "Zahra", type: "Friendship", intensity: 0.25, memory: "The most no-nonsense advice" },
    { id: 32, name: "Mom", type: "Family", intensity: .5, memory: "How to be fiercely independent" },
    { id: 33, name: "Mom", type: "Family", intensity: .4, memory: "Life never gives you anything you can't handle" },

].map(rel => ({
    ...rel,
    color: colorPalette[Math.floor(Math.random() * colorPalette.length)]
}));


document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.querySelector('.cta-btn');
    ctaButton.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent immediate navigation
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = 'mosaic.html';
      }, 800); // Match this with your transition duration
    });
  });

// Make width and height responsive to viewport
const width = window.innerWidth;
const height = window.innerHeight - 100; // Subtract some space for filters
const padding = 80; // Increased padding for better spacing

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
        .force("charge", d3.forceManyBody().strength(-200)) // Negative strength for repulsion
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => Math.sqrt(d.intensity) * 100))
        .force("x", d3.forceX(width / 2).strength(0.05)) // Weak force to center
        .force("y", d3.forceY(height / 2).strength(0.05)); // Weak force to center
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
        .attr("r", d => Math.sqrt(d.intensity) * 80)
        .style("fill", d => d.color)
        .style("opacity", d => d.intensity)
        .on("click", function(event, d) {
            event.stopPropagation();
            
            if (activeCircle === this) {
                d3.select(this)
                    .classed("active", false)
                    .classed("pulsing", true)
                    // .style("stroke", "none");
                    .style("filter", "blur(0px)"); // Remove blur
                tooltip.transition()
                    .duration(1500)
                    .style("opacity", 0);
                activeCircle = null;
                return;
            }

            if (activeCircle) {
                // Reset previous active circle
                d3.select(activeCircle)
                    .classed("active", false)
                    .classed("pulsing", true)
                    // .style("stroke", "none");

                    .style("filter", "blur(0px)"); // Remove blur
            }

            activeCircle = this;
            d3.select(this)
                .classed("active", true)
                .classed("pulsing", false)
                // .style("stroke", "#fff")
                // .style("stroke-width", "4px");

                .style("filter", "blur(1px)"); // APPLY BLUR

            tooltip.transition()
                .duration(1500)
                .style("opacity", .9);
            
                // TOOLTIPS DISPLAY
            tooltip.html(`
                <div class="tooltip-bold">${d.name}</div>
                <div class="tooltip-reg">${d.memory}</div>
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
            .strength(-200 - Math.random() * 100); // Increased repulsion
        
        simulation.force("x")
            .strength(0.05 + Math.random() * 0.1); // Variable x-force
        
        simulation.force("y")
            .strength(0.05 + Math.random() * 0.1); // Variable y-force
        
        simulation.alpha(0.3).restart();
    }

    simulation.on("tick", () => {
        tiles
            .attr("cx", d => {
                return d.x = Math.max(padding + d.intensity * 80, 
                    Math.min(width - padding - d.intensity * 80, d.x));
            })
            .attr("cy", d => {
                return d.y = Math.max(padding + d.intensity * 80, 
                    Math.min(height - padding - d.intensity * 80, d.y));
            });
    });

    setInterval(updateForces, 5000);
}

// Initial visualization
updateVisualization(relationships);

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight - 100;
    svg.attr("width", width)
       .attr("height", height);
    simulation.force("center", d3.forceCenter(width / 2, height / 2));
    simulation.alpha(1).restart();
});

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

if (!d3) {
    console.error('D3.js failed to load');
}