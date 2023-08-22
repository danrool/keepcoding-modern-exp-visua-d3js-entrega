
const width = 900
const height = 600
const heightBarra = 350
const margin = {top: 70, right: 20, bottom: 50, left: 100 }
const toDate = new Date(2021, 10, 6)
let fromDate = new Date(2020, 10, 6)

let currentData 
let filterData

const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("class", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

const axisGroup = svg.append("g").attr("class", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("class", "xAxisGroup").attr("transform", `translate(${margin.left}, ${heightBarra - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("class", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

const xvAxisGroup = axisGroup.append("g").attr("class", "xvAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yvAxisGroup = axisGroup.append("g").attr("class", "yvAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)


let x = d3.scaleTime().range([0, width - margin.left - margin.right])
let y = d3.scaleLinear().range([heightBarra - margin.bottom  - margin.top, 0])

var xv = d3.scaleBand().range([0, width - margin.left - margin.right])
var yv = d3.scaleLinear().range([ height - margin.bottom  - margin.top , height  + margin.top - heightBarra ])


const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

const xvAxis = d3.axisBottom().scale(xv)
const yvAxis = d3.axisLeft().scale(yv)

const transformarFecha = d3.timeParse("%d/%m/%Y")

const title = svg.append("text").attr("class","title").text("IBEX")
                .attr("fill","black").attr("dx","2em")
                .attr("font-family", "Roboto")
                .attr("font-weight", "bold")
                .attr("transform",`translate(${margin.left}, ${30})`)
  

const titleCierre = svg.append("text").attr("class","title2").text("Cierres")
                .attr("fill","black").attr("font-size","1.25em")
                .attr("font-family", "Roboto")
                .attr("font-weight", "bold")
                .attr("transform",`translate(${margin.left -30}, ${50})`)

const titleVolumen = svg.append("text").attr("class","title2").text("Volumen")
                .attr("fill","black").attr("font-size","1.25em")
                .attr("font-family", "Roboto")
                .attr("font-weight", "bold")
                .attr("transform",`translate(${margin.left-30}, ${350})`)

const footerAutor = svg.append("text").attr("class","title2").text("Rolando Rodriguez 2023 - Keepcoding Visualización de datos moderna con D3.js - Entrega Opción 3")
                .attr("fill","black").attr("font-size",".75em")
                .attr("font-family", "Roboto")
                .attr("transform",`translate(${margin.left-100}, ${595})`)

d3.csv("ibex.csv").then(data => {
    data.map( d => {
        d.open = +d.open
        d.high = +d.high
        d.low = +d.low
        d.close = +d.close
        d.volume = +d.volume
        d.date = transformarFecha(d.date)
    })
 
    mostrarCierres(data)
    mostrarVolumen(data)

})


function mostrarCierres(midata){

    x.domain(d3.extent(midata.map(d => d.date)))
    y.domain(d3.extent(midata.map(d => d.close)))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    elementGroup.datum(midata)
        .append('path')
        .attr("id","linea")
        .attr("d", d3.line()
                    .x(d => x(d.date))
                    .y(d => y(d.close)))

}

function mostrarVolumen(midata){
    xv.domain(midata.map(d => d.date))
//    xv.domain( d3.extent(midata.map(d => d.date)))
    yv.domain(d3.extent(midata.map(d => d.volume)))

    yvAxisGroup.call(yvAxis)

    const elements  = elementGroup.selectAll("rect").data(midata)

    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn) // Colores de rojo a verde

    elements.enter()
        .append("rect")
        .attr("class", d => d.date) 
        .attr("x", d => xv(d.date))
        .attr("y", d => yv(d.volume))
        .attr("width", xv.bandwidth()) 
        
        .attr("height", d =>  height - margin.top - margin.bottom -  yv(d.volume))

        .attr("fill", (d, i) => {
            if (i === 0) return "gray"; // Primera barra no tiene color
            const diff = d.volume - midata[i - 1].volume;
            return colorScale(diff);
        })

}
