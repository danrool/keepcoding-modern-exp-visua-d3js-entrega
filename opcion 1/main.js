// CHART START
// 1. aquí hay que poner el código que genera la gráfica
const width = 800
const height = 400
const margin = {top: 80, right: 10, bottom: 20, left: 100}

const svg = d3.select("div#chart").append("svg").attr("id","svg").attr("width", width).attr("height",height)
const elementGroup = svg.append("g").attr("id","elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)


let x = d3.scaleBand().range([0,width - margin.left - margin.right]).padding(0.2)
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])


const axisGroup = svg.append("g").attr("id","axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id","xAxisGroup").attr("transform",`translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id","yAxisGroup").attr("transform",`translate(${margin.left}, ${margin.top})`)
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)


let years;
let winners;
let originalData;

let title = svg.append("text").attr("class","title").text("Campeones del mundo hasta").attr("transform",`translate(${margin.left+50}, ${margin.top-30})` )
let titleyear = svg.append("text").attr("class","title").text("aaa").attr("id","value-time").attr("transform",`translate(${margin.left+520}, ${margin.top-30})` )


function ActualizarDominiosyEjes(){
        x.domain(winners.map(d => d.key))
    y.domain([ 0,d3.max(winners.map(d => d.value))])
    
    yAxis.ticks(d3.max(winners.map(d => d.value)))
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
}


// data:
d3.csv("WorldCup.csv").then(data => {
    // 2. aquí hay que poner el código que requiere datos para generar la gráfica

    originalData = data
    years = data.map(d => d.Year)
    winners = d3.nest()
        .key((d) => d.Winner)
        .rollup((group) => group.length) // Cuenta la cantidad de victorias por país
        .entries(data);

    ActualizarDominiosyEjes()

    // update:
    slider()
    update(winners)
})


// update:
function update(data) {
    // 3. función que actualiza el gráfico
    const elements  = elementGroup.selectAll("rect").data(data)

    elements.enter()
        .append("rect")
        .attr("class", d => d.key) 
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth()) 
        .attr("height", d => height - margin.top - margin.bottom -  y(d.value))
        .append("title").text((d) => d.key)

    elements
    .transition()
    .duration(1500)
    .attr("class", d => d.key) 
    .attr("x", d => x(d.key))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth()) 
    .attr("height", d => height - margin.top - margin.bottom -  y(d.value))

    elements
        .exit()
        .transition()
        .duration(700)
        .remove()
  
}

// treat data:
function filterDataByYear(year) { 
    // 4. función que filtra los datos dependiendo del año que le pasemos (year)

    const aux = originalData.filter((d) => d.Year <= year)
    winners = d3.nest()
        .key((d) => d.Winner)
        .rollup((group) => group.length) // Esta función cuenta la cantidad de victorias por país
        .entries(aux);
    
    ActualizarDominiosyEjes()

    d3.select('#value-time').text(year);  // actualiza el año que se representa
}


// CHART END

// slider:
function slider() {    

    var tickValues = years.filter((year, index) => index % 4 === 0);    

    // esta función genera un slider:
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider (4 años)
        .width(680)  // ancho de nuestro slider en px
        .ticks(years.length)  
        .default(years[years.length -1])  // punto inicio del marcador
        .on('onchange', val => {
            // 5. AQUÍ SÓLO HAY QUE CAMBIAR ESTO:

            //console.log("La función aún no está conectada con la gráfica")
            // hay que filtrar los datos según el valor que marquemos en el slider y luego actualizar la gráfica con update
            filterDataByYear(val)
            update(winners)
        });

        // contenedor del slider
        var gTime = d3 
            .select('div#slider-time')  // div donde lo insertamos
            .append('svg')
            .attr('width', width)
            .attr('height', 70)
            .append('g')
            .attr('transform', 'translate(100, 30)')
            .attr('position','absolute');

        gTime.call(sliderTime);  // invocamos el slider en el contenedor

        d3.select('#value-time').text(sliderTime.value());  // actualiza el año que se representa
}

