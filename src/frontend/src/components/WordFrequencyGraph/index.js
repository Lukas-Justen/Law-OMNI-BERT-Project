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
        if (this.props.data !== nextProps.data) {
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
        // Transform the data
        const trainingData = this.props.data.map(x => {
            return {y: x.train}
        });
        const validationData = this.props.data.map(x => {
            return {y: x.test}
        });

        // Define the parent div and svg
        const parent = d3.select("." + this.props.id);
        const margin = {top: 10, left: 50, right: 50, bottom: 65};
        const svg = this.getSvg(parent);

        // Define the axis and the gridlines
        const x = this.getX(trainingData, margin);
        const y = this.getY(trainingData, validationData, margin);
        const xTicks = this.getXTicks();
        const yTicks = this.getYTicks();
        this.getXAxis(x, xTicks, margin, svg);
        this.getYAxis(y, yTicks, margin, svg);
        this.getGridlinesY(svg, margin, y, yTicks);

        var area = d3.area()
            .x(function(d, i) { return x(i); })
            .y0(this.props.height)
            .y1(function(d, i) { return y(d.y); });

        svg.append("path")
            .data(trainingData)
            .attr("class", "area")
            .attr("d", area);

        // Build a legend for training and testing path
        this.buildLegend(svg, margin);

        // Build a slider that highlight the current values
        const focus = svg.append("g").style("display", "none");
        const yLine = this.getYLine(focus, margin);
        const circle1 = this.getHighlightCircle(focus, "darkorange", margin);
        const circle2 = this.getHighlightCircle(focus, "steelblue", margin);
        const rect = this.getMouseMoveRect(svg, margin, focus);
        const move = function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = Math.floor(x0),
                d1 = trainingData[i] ? trainingData[i] : trainingData[0],
                d2 = validationData[i] ? validationData[i] : validationData[0];

            if (i < (trainingData.length) && i >= 0) {
                circle1
                    .attr("cx", x(i))
                    .attr("cy", y(d1.y));

                circle2
                    .attr("cx", x(i))
                    .attr("cy", y(d2.y));

                yLine
                    .attr("x1", x(i))
                    .attr("x2", x(i));
            }
        };
        rect.on("mousemove", move);

        // Draw the lines
        const transitionPath = this.defineTransitionPath();
        this.buildPath(svg, margin, validationData, x, y, transitionPath, animate, "validation", "steelblue");
        this.buildPath(svg, margin, trainingData, x, y, transitionPath, animate, "training", "darkorange");
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
        return d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([0, this.state.width - margin.left - margin.right]);
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
            .domain([0, max * 1.05])
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
            .style("fill", "darkorange");

        svg.append("circle")
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
            .attr("cx", 105).attr("cy", this.state.height - margin.bottom / 2 + 7)
            .attr("r", 6)
            .style("fill", "steelblue");

        svg.append("text")
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
            .attr("x", 20)
            .attr("y", this.state.height - margin.bottom / 2 + 7)
            .text("Training")
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");

        svg.append("text")
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
            .attr("x", 120)
            .attr("y", this.state.height - margin.bottom / 2 + 7)
            .text("Validation")
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");

        svg.append("text")
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
            .attr("x", (this.state.width - margin.right) - 100)
            .attr("y", this.state.height - margin.bottom / 2 + 7)
            .text("Epochs")
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");
    }

    getYLine(focus, margin) {
        return focus.append("line")
            .attr("class", "x")
            .style("stroke", "#d9d9dd")
            .attr("y1", 0)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .attr("y2", this.state.height - margin.top - margin.bottom);
    }

    getHighlightCircle(focus, color, margin) {
        return focus.append("circle")
            .attr("class", "y")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .style("fill", color)
            .attr("r", 4.5);
    }

    getMouseMoveRect(svg, margin, focus) {
        return svg.append("rect")
            .attr("width", this.state.width - margin.left - margin.right + 10)
            .attr("height", this.state.height - margin.top - margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function () {
                focus.style("display", null);
            })
            .on("mouseout", function () {
                focus.style("display", "none");
            });
    }

    buildPath(svg, margin, data, x, y, transitionPath, animate, legend, color) {
        const buildPath = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .attr("stroke", color)
            .attr("stroke-opacity", 0.7)
            .attr("data-legend", legend)
            .attr("stroke-width", 2.0)
            .attr("d", d3.line()
                .x(function (d, i) {
                    return x(i)
                })
                .y(function (d) {
                    return y(d.y)
                })
            );

        buildPath.on("mouseover", function (d) {
            buildPath
                .style("stroke-width", 3.0)
                .style("stroke-opacity", 1.0);
        }).on("mouseout", function (d) {
            buildPath
                .style("stroke-opacity", 0.7)
                .style("stroke-width", 2.0);
        });

        if (animate) {
            const pathLength = buildPath.node().getTotalLength();

            buildPath.attr("stroke-dashoffset", pathLength)
                .attr("stroke-dasharray", pathLength)
                .transition(transitionPath)
                .attr("stroke-dashoffset", 0);
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