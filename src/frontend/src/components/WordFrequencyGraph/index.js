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
        if (this.props.dataB !== nextProps.dataB || this.props.dataA !== nextProps.dataA || this.props.filterWord !== nextProps.filterWord) {
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
        // var data = this.props.dataA.map(o => {
        //     return {x: o.word, y: o.count}
        // });
        //
        // const filterWord = this.props.filterWord.toLowerCase();
        //
        // function filterFunction(sample) {
        //     return sample.x.toLowerCase().includes(filterWord)
        // }
        //
        // if (filterWord !== "") {
        //     data = data.filter(filterFunction)
        // }
        //
        // if (data.length > 30) {
        //     data = data.slice(0, 30);
        // }

        var data = [
            {
                "word": "Student",
                "values": [
                    {
                        "value": 1,
                        "corpus": "Corpus A"
                    },
                    {
                        "value": 4,
                        "corpus": "Corpus B"
                    }
                ]
            },
            {
                "word": "Test",
                "values": [
                    {
                        "value": 2,
                        "corpus": "Corpus A"
                    },
                    {
                        "value": 1,
                        "corpus": "Corpus B"
                    }
                ]
            },
            {
                "word": "AA",
                "values": [
                    {
                        "value": 2,
                        "corpus": "Corpus A"
                    },
                    {
                        "value": 1,
                        "corpus": "Corpus B"
                    }
                ]
            },];

        // Define the parent div and svg
        const parent = d3.select("." + this.props.id);
        const margin = {top: 10, left: 50, right: 50, bottom: 65};
        const svg = this.getSvg(parent);
        const corpora = data[0].values.map(function (d) {
            return d.corpus;
        });

        // Define the axis and the gridlines
        const x0 = this.getX0(data, margin);
        const x1 = this.getX1(data, x0, corpora);
        const y = this.getY(data, margin);
        const xTicks = this.getXTicks();
        const yTicks = this.getYTicks();
        const colors = this.getColorSchema();
        this.getXAxis(x0, xTicks, margin, svg);
        this.getYAxis(y, yTicks, margin, svg);
        this.getGridlinesY(svg, margin, y, yTicks);

        // Build a legend for the corpora
        this.buildLegend(svg, margin, corpora, colors);

        // Draw the bars
        this.buildBars(svg, data, x0, x1, colors, y, margin, animate);
    }


    // Drawing functions that are used to draw the tensorboard graph
    getSvg(parent) {
        return parent
            .append("svg")
            .attr("height", this.state.height)
            .attr("width", this.state.width);
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

    getX0(data, margin) {
        var words = data.map(function (d) {
            return d.word;
        });

        console.log(words);

        return d3.scaleBand()
            .domain(words)
            .rangeRound([0, this.state.width - margin.left - margin.right])
            .padding(0.2);
    }

    getX1(data, x0, corpora) {
        return d3.scaleBand()
            .domain(corpora)
            .range([0, x0.bandwidth()])
            .paddingInner(0.1);
    }

    getY(data, margin) {
        // const max1 = d3.max(data1, function (d) {
        //     return d.y;
        // });
        // const max2 = d3.max(data2, function (d) {
        //     return d.y;
        // });
        // const max = Math.max(max1, max2);

        return d3.scaleLinear()
            .domain([0, d3.max(data, function (word) {
                return d3.max(word.values, function (d) {
                    return d.value;
                });
            })])
            .range([this.state.height - margin.top - margin.bottom, 0]);
    }

    getColorSchema() {
        return d3.scaleOrdinal()
            .range(["#7F9DEE", "#97d094"]);
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

    buildLegend(svg, margin, corpora, colors) {
        corpora.forEach((value, index) => {
            svg.append("circle")
                .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
                .attr("cx", 5 + index * 145).attr("cy", this.state.height - margin.bottom / 2 + 7)
                .attr("r", 6)
                .style("fill", colors(value))
                .style("fill-opacity", 0.8);

            svg.append("text")
                .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
                .attr("x", 20 + index * 145)
                .attr("y", this.state.height - margin.bottom / 2 + 7)
                .text(value)
                .style("font-size", "15px")
                .attr("alignment-baseline", "middle");
        });

        svg.append("text")
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
            .attr("x", (this.state.width - margin.right) - 100)
            .attr("y", this.state.height - margin.bottom / 2 + 7)
            .text("Words")
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");
    }

    buildBars(svg, data, x0, x1, colors, y, margin, animate) {
        const h = this.state.height - margin.bottom - margin.top;
        var slice;

        if (animate) {
            slice = svg.selectAll(".slice")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function (d) {
                    return "translate(" + x0(d.word) + "," + margin.top + ")";
                });

            slice.selectAll("rect")
                .data(function (d) {
                    return d.values;
                })
                .enter().append("rect")
                .attr("transform", "translate(" + margin.left + "," + 0 + ")")
                .attr("width", x1.bandwidth())
                .attr("x", function (d) {
                    return x1(d.corpus);
                })
                .style("fill", function (d) {
                    return colors(d.corpus)
                })
                .attr("y", function (d) {
                    return y(0);
                })
                .attr("height", function (d) {
                    return h - y(0);
                })
                .on("mouseover", function (d) {
                    d3.select(this).style("fill", d3.rgb(colors(d.corpus)).darker(1));
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("fill", colors(d.corpus));
                });

            svg.selectAll("rect")
                .transition()
                .duration(1000)
                .attr("transform", "translate(" + margin.left + "," + 0 + ")")
                .attr("y", function (d) {
                    return y(d.value);
                })
                .attr("height", function (d) {
                    return h - y(d.value);
                })
                .delay(function (d, i) {
                    return (i * 25)
                });
        } else {
            slice = svg.selectAll(".slice")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function (d) {
                    return "translate(" + x0(d.word) + "," + margin.top + ")";
                });

            slice.selectAll("rect")
                .data(function (d) {
                    return d.values;
                })
                .enter().append("rect")
                .attr("transform", "translate(" + margin.left + "," + 0 + ")")
                .attr("width", x1.bandwidth())
                .attr("x", function (d) {
                    return x1(d.corpus);
                })
                .style("fill", function (d) {
                    return colors(d.corpus)
                })
                .attr("y", function (d) {
                    return y(d.value);
                })
                .attr("height", function (d) {
                    return h - y(d.value);
                })
                .on("mouseover", function (d) {
                    d3.select(this).style("fill", d3.rgb(colors(d.corpus)).darker(1));
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("fill", colors(d.corpus));
                });
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