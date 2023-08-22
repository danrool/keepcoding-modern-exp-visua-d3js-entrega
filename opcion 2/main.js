const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)

// ----------------------------------------------------------

const width = 900
const height = 560
const margin = {top: 100, right: 20, bottom: 50, left: 30 }

const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("class", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("class", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("class", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("class", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

const x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1)
const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
const z = d3.scaleLinear().range([ 0, width - margin.left - margin.right])

const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)



let titledc = svg.append("text").attr("class", "title").html("<tspan font-weight='bold'>E&nbsp;&nbsp;D&nbsp;&nbsp;A&nbsp;&nbsp;D&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D&nbsp;&nbsp;E&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L&nbsp;&nbsp;E&nbsp;&nbsp;O&nbsp;&nbsp;N&nbsp;&nbsp;A&nbsp;&nbsp;R&nbsp;&nbsp;D&nbsp;&nbsp;O&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D&nbsp;&nbsp;I&nbsp;&nbsp;C&nbsp;&nbsp;A&nbsp;&nbsp;P&nbsp;&nbsp;R&nbsp;&nbsp;I&nbsp;&nbsp;O")
                .attr("fill","darkorange")
                .attr("transform", `translate(${margin.left-10}, ${30})`)
                .attr("dx", "1em")

const titlevs = svg.append("text").attr("class", "title").html("<tspan font-weight='bold'>VS&nbsp;&nbsp;")
                .attr("fill","gray")
                .attr("transform", `translate(${margin.left + 495}, ${30})`)
                .attr("dx", "1em")

                
const footerAutor = svg.append("text").attr("class","title2").text("Rolando Rodriguez 2023 - Keepcoding Visualización de datos moderna con D3.js - Entrega Opción 2")
.attr("fill","gray").attr("font-size",".75em")
.attr("font-family", "Roboto")
.attr("transform",`translate(${margin.left}, ${560})`)

const titlegf = svg.append("text").attr("class", "title").html("<tspan font-weight='bold'>E&nbsp;&nbsp;D&nbsp;&nbsp;A&nbsp;&nbsp;D&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;D&nbsp;&nbsp;E&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S&nbsp;&nbsp;U&nbsp;&nbsp;S&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E&nbsp;&nbsp;X&nbsp;&nbsp;'&nbsp;&nbsp;s")
                .attr("fill","rgba(0,212,255,1)")
                .attr("transform", `translate(${margin.left +540}, ${30})`)
                .attr("dx", "1em")
//Linea de referencia
const lineld = svg.append("line")
        .attr("x1", margin.left)
        .attr("x2", margin.left +100)
        .attr("y1", 50)
        .attr("y2", 50)
        .attr("stroke", "darkorange")
        .attr("stroke-width", "3px")

const circuleld = svg.append("circle")
    .attr("r", 4)
    .attr("cx", margin.left + 100 / 2)
    .attr("cy", 50)
    .style("fill","#0B001E")
    .attr("stroke","darkorange")
    .attr("stroke-width","3") 

//Linea de referencia
const linegf = svg.append("line")
    .attr("x1", margin.left+555)
    .attr("x2", margin.left + 655)
    .attr("y1", 50)
    .attr("y2", 50)
    .attr("stroke", "rgba(0,212,255,1)")
    .attr("stroke-width", "3px")


// Procesamiento de datos
d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year  = +d.year
        d.age = +d.age
        d.dcage = +d.year - diCaprioBirthYear
    })
    

    x.domain(data.map(d => d.year ))
    //y.domain([d3.min(data.map(d => d.year )) - diCaprioBirthYear -10, d3.max(data.map(d => d.year )) - diCaprioBirthYear])
    // se cambio para una mejor visualizacion
    y.domain([5, d3.max(data.map(d => d.year )) - diCaprioBirthYear])
    z.domain([d3.min(data.map(d => d.year )) - diCaprioBirthYear, d3.max(data.map(d => d.year )) - diCaprioBirthYear])
    xAxisGroup.call(xAxis)
    //yAxisGroup.call(yAxis)  // No muestro el eje Y por estética
     
    let elements = elementGroup.selectAll("rect").data(data)
    
    // Definición para el gradiente
    var gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "barGradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

    // Agregar los puntos de color al gradiente
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("style", "stop-color: rgba(2,0,36,1)");
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("style", "stop-color: rgba(0,212,255,1)");

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");


    // Agregar la imagen al tooltip
    tooltip.append("image")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 100)

    // Agregar el texto al tooltip
    tooltip.append("text")
    .attr("x", 0)
    .attr("y", 120)
    .style("font-size", "12px")
    .style("fill", "white");

    elements.enter()
         .append("rect")
         .attr("class", (d) => d.name.replaceAll(" ", ""))
         .attr("x", (d) => x(d.year))
         .attr("y", (d) => y(d.age) )
         .attr("width", x.bandwidth())
         .attr("height", (d) => height - margin.top -margin.bottom - y(d.age))
         .attr("fill", "url(#barGradient)") // Gradiente definido
         .on("mouseover", function(d) {
            tooltip.style("display", "block")
            .html(`<strong style="text-align:center;">${d.name}</strong><br>
                <p style="text-align:center; font-family:'Quicksand',sans-serif;font-size:1em"><img src=male.svg>  ${d.dcage} -
                <img src=female.svg>   ${d.age}</p>

                <img src=${d.name.replaceAll(" ", "")}.png alt=${d.name}>`);
            // Calcula la posición del tooltip
            const rect = this.getBoundingClientRect();
            const rectWidth = rect.width;

            // Calcular la posición del tooltip en función del centro del rectángulo
            const tooltipX = rect.left + rectWidth;
            const tooltipY = rect.top + window.scrollY - 205;



            // Establece la posición del tooltip
            tooltip.style("left", `${tooltipX}px`)
                    .style("top", `${tooltipY}px`);
        })
        .on("mouseout", function() {
            // Ocultar el tooltip al salir
            tooltip.style("display", "none")
        })
        .append("title").text((d) => d.name)
        
    

    // Linea
    elementGroup.datum(data)
        .append("path")
        .attr("id", "leonardo")
        .attr("d", d3.line().x(d => x(d.year)).y(d => y(d.dcage)))
        .attr("fill","none")
        .attr("stroke","black")
        .attr("stroke-width",3)

    // Circulos 
    const circles = elementGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("cx", (d) => x(d.year))
        .attr("cy", (d) =>  y(d.dcage))
        .style("fill","#0B001E") 
        .attr("stroke","darkorange")
        .attr("stroke-width","3")

    // Textos Leonardo
    const dcage = elementGroup.selectAll(".dcage")
        .data(data)
        .enter()
        .append("text")
        .attr("id", (d) => `dcage${d.dcage}`)
        .text((d) => d.dcage)
        .attr("font-family", "'Quicksand', sans-serif")
        .attr("font-weight", "bold")
        .attr("fill","darkorange")
        .attr("transform", (d) => `translate(${x(d.year) - 8 }, ${y(d.dcage) - 10 })`)
        
    // Textos Girlfriend
    const gfage = elementGroup.selectAll(".gfage")
        .data(data)
        .enter()
        .append("text")
        .attr("id", (d) => `gfage_${d.age}_${d.age}`)
        .text((d) => d.age)
        .attr("font-family", "'Quicksand', sans-serif")
        .attr("font-weight", "bold")
        .attr("fill","rgba(0,212,255,1)")
        .attr("transform", (d) => `translate(${x(d.year)+8}, ${y(d.age) - 8 })`)

    const lineaMaxAge = d3.max(data.map(d => d.age )) 
        

    const lineaMaxAgeGirls = svg.append("line")
        .attr("x1", margin.left-10) 
        .attr("x2", width+10) 
        .attr("y1",height - margin.top + margin.bottom - y(lineaMaxAge))        
        .attr("y2", height - margin.top + margin.bottom - y(lineaMaxAge))        
        .attr("stroke-width", 1)
        .attr("stroke", "red")
        .attr("stroke-dasharray", "4,4")

})