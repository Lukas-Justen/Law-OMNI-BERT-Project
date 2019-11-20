import React from "react";
import './index.css';
import * as d3 from "d3";

class WordFrequencyGraph extends React.Component {

    // Constructor initailizes the height and width state with 0
    constructor(props, context) {
        super(props, context);

        this.state = {width: 0, height: 0};
    }


    // The following three functions are responsible for resizing/updating
    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.data !== nextProps.data || this.props.filterWord !== nextProps.filterWord) {
            this.redrawChart(true)
        }
    }

    componentDidMount() {
        let resizedFn;
        window.addEventListener("resize", () => {
            clearTimeout(resizedFn);
            resizedFn = setTimeout(() => {
                this.redrawChart(false);
            }, 50)
        });

        this.redrawChart(true);
    }

    redrawChart(animate) {
        const parent = d3.select("." + this.props.id);
        let width = parent.node().getBoundingClientRect().width;
        let height = parent.node().getBoundingClientRect().height;
        this.setState({width: width, height: height}, () => {
            d3.select("." + this.props.id + " svg").remove();
            this.drawChart(animate);
        });
    }


    // Draws the svg and all child components
    drawChart(animate) {
        // Transform the corpus1
        var corpus1 = this.props.data.map(o => {
            return {x: o.word, y: o.count}
        });

        const filterWord = this.props.filterWord.toLowerCase();

        function filterFunction(sample){
            return sample.x.toLowerCase().includes(filterWord)
        }

        if (filterWord !== "") {
            corpus1 = corpus1.filter(filterFunction)
        }

        if (corpus1.length > 30) {
            corpus1 = corpus1.slice(0,30);
        }

        var corpus2 = corpus1;

        // Define the parent div and svg
        const parent = d3.select("." + this.props.id);
        const margin = {top: 10, left: 50, right: 50, bottom: 65};
        const svg = this.getSvg(parent);

        // Define the axis and the gridlines
        const x = this.getX(corpus1, margin);
        const y = this.getY(corpus1, corpus2, margin);
        const xTicks = this.getXTicks();
        const yTicks = this.getYTicks();
        this.getXAxis(x, xTicks, margin, svg);
        this.getYAxis(y, yTicks, margin, svg);
        this.getGridlinesY(svg, margin, y, yTicks);

        // Build a legend for the corpora
        this.buildLegend(svg, margin);

        this.buildBar(margin, svg, corpus1, x, y, "#7F9DEE", animate);
    }


    // Drawing functions that are used to draw the tensorboard graph
    getSvg(parent) {
        return parent
            .append("svg")
            .attr("height", this.state.height)
            .attr("width", this.state.width);
    }

    defineTransitionPath() {
        return d3.transition()
            .ease(d3.easeSin)
            .duration(1000);
    }

    getXAxis(x, xTicks, margin, svg) {
        const xAxis = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + (this.state.height - margin.bottom) + ")")
            .call(d3.axisBottom(x).ticks(xTicks));

        xAxis.style("font-size", 12)
            .style("color", "#939396");
        xAxis.select('path')
            .style('stroke', "#d9d9dd");
        xAxis.selectAll('line')
            .style('stroke', "#d9d9dd");

        return xAxis;
    }

    getYAxis(y, yTicks, margin, svg) {
        const yAxis = svg.append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(d3.axisLeft(y).ticks(yTicks));

        yAxis.style("font-size", 12)
            .style("color", "#939396");
        yAxis.select('path')
            .style('stroke-opacity', 0.0);
        yAxis.selectAll('line')
            .style('stroke-opacity', 0.0);

        return yAxis;
    }

    getX(data, margin) {
        return d3.scaleBand()
            .domain(data.map(function(d) { return d.x; }))
            .range([0, this.state.width - margin.left - margin.right])
            .padding(0.4);
    }

    getY(data1, data2, margin) {
        const max1 = d3.max(data1, function (d) {
            return d.y;
        });
        const max2 = d3.max(data2, function (d) {
            return d.y;
        });
        const max = Math.max(max1, max2);

        return d3.scaleLinear()
            .domain([0, max])
            .range([this.state.height - margin.top - margin.bottom, 0]);
    }

    getXTicks() {
        return ((this.state.width / 150) >> 0) >= 5 ? ((this.state.width / 150) >> 0) : 5;
    }

    getYTicks() {
        return ((this.state.width / 150) >> 0) >= 5 ? ((this.state.width / 150) >> 0) : 5;
    }

    getGridlinesY(svg, margin, y, yTicks) {
        const gridlinesY = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.axisLeft(y)
                .ticks(yTicks)
                .tickSize(-(this.state.width - margin.left - margin.right))
                .tickFormat("")
            );

        gridlinesY.selectAll("line").style("stroke", "#d9d9dd");
        gridlinesY.selectAll("path").style("stroke-opacity", 0.0);

        return gridlinesY;
    }

    buildLegend(svg, margin) {
        svg.append("circle")
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
            .attr("cx", 5).attr("cy", this.state.height - margin.bottom / 2 + 7)
            .attr("r", 6)
            .style("fill", "#4972e5")
            .style("fill-opacity", 0.8);

        svg.append("text")
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
            .attr("x", 20)
            .attr("y", this.state.height - margin.bottom / 2 + 7)
            .text(this.props.docName)
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");

        svg.append("text")
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
            .attr("x", (this.state.width - margin.right) - 100)
            .attr("y", this.state.height - margin.bottom / 2 + 7)
            .text("Words")
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");
    }

    buildBar(margin, svg, data, x, y, color, animate) {
        const h = this.state.height - margin.bottom - margin.top;

        if (animate) {
            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.x); })
                .attr("width", x.bandwidth())
                .style("fill", color)
                .attr("y", function(d) { return y(0); })
                .attr("height", function(d) {return h - y(0) });

            svg.selectAll("rect")
                .transition()
                .duration(1000)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("y", function (d) {
                    return y(d.y);
                })
                .attr("height", function (d) {
                    return h - y(d.y);
                })
                .delay(function (d, i) {
                    return (i * 25)
                })
        } else {
            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.x); })
                .attr("width", x.bandwidth())
                .style("fill", color)
                .attr("y", function(d) { return y(d.y); })
                .attr("height", function(d) {return h - y(d.y) });
        }
    }


    // Creates a div element which will serve as a parent node for the svg
    render() {
        const canvasStyle = {
            height: this.props.height,
            width: "100%"
        };

        return <div className={this.props.id} style={canvasStyle}/>
    }

}

export default WordFrequencyGraph;