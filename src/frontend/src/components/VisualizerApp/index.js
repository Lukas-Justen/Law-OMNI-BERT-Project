import React from 'react';
import './index.css';
import {
    MDBBtn,
    MDBCard, MDBCol, MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav, MDBRow
} from "mdbreact";

import WordFrequencyGraph from "../WordFrequencyGraph";
import ModalDocument from "../DocumentModal";

class VisualizerApp extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            modal: false,
            frequencies: false,
            namea: "Corpus A",
            documenta: "",
            nameb: "Corpus B",
            documentb: "",
            filterWord: "",
            wordsa: 0,
            vocaba: 0,
            readabilitya: 0,
            wordsb: 0,
            vocabb: 0,
            readabilityb: 0,
            freq_clip: 30
        };
        this.toggle = this.toggle.bind(this);
        this.handleChangeNameA = this.handleChangeNameA.bind(this);
        this.handleChangeNameB = this.handleChangeNameB.bind(this);
        this.analyze = this.analyze.bind(this);
        this.handleDocumentChangeA = this.handleDocumentChangeA.bind(this);
        this.handleDocumentChangeB = this.handleDocumentChangeB.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleChangeFreqClip = this.handleChangeFreqClip.bind(this);
    }

    toggle() {
        this.setState(
            {
                modal: !this.state.modal
            }
        );
    }


    handleChangeNameA(event) {
        if (event.target.value === "") {
            this.setState({
                namea: "Corpus A"
            })
        } else {
            this.setState({
                namea: event.target.value
            })
        }
    }

    handleDocumentChangeA(event) {
        this.setState({
            documenta: event.target.value
        })

    }

    handleChangeNameB(event) {
        if (event.target.value === "") {
            this.setState({
                nameb: "Corpus B"
            })
        } else {
            this.setState({
                nameb: event.target.value
            })
        }
    }

    handleDocumentChangeB(event) {
        this.setState({
            documentb: event.target.value
        })

    }

    handleSearchChange(event) {
        this.setState({
            filterWord: event.target.value
        }, ()=>{this.fetchData()})
    }

    handleChangeFreqClip(event) {
        if (event.target.value === "" || parseInt(event.target.value) <= 0) {
            this.setState({
                freq_clip: 30
            }, ()=>{this.fetchData()})
        } else {
            this.setState({
                freq_clip: parseInt(event.target.value)
            },()=>{this.fetchData()})
        }


    }

    fetchData() {
        fetch("http://127.0.0.1:5000/analyze", {
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "body": {
                    "corpus_a": this.state.documenta,
                    "corpus_b": this.state.documentb,
                    "corpus_a_name": this.state.namea,
                    "corpus_b_name": this.state.nameb,
                    "freq_clip": this.state.freq_clip,
                    "filter_word": this.state.filterWord,
                }
            }),
            method: "POST"
        }).then(value => value.json()
        ).then(json => {
            this.setState({
                frequencies: json.body.frequencies,
                wordsa: json.body.total_num_words_a,
                vocaba: json.body.unique_words_a.length,
                wordsb: json.body.total_num_words_b,
                vocabb: json.body.unique_words_b.length
            });
        }).catch(error => {
            console.log(error)
        });
    }

    analyze() {
        this.toggle();
        this.fetchData();
    }

    render() {
        var graph = <div/>;
        if (this.state.frequencies.length > 0) {
            graph = <WordFrequencyGraph id={"word-frequency"} data={this.state.frequencies} height={"calc(100% - 60px)"}
                                        filterWord={this.state.filterWord}/>;
        }
        return (
            <div className={"h-100"}>

                <MDBNavbar color="white" light expand="md">
                    <MDBNavbarNav left>
                        <MDBNavbarBrand>
                            <a href={"https://www.mccormick.northwestern.edu/artificial-intelligence/"}>
                                <img
                                    src="https://cdn.bleacherreport.net/images/team_logos/328x328/northwestern_football.png"
                                    alt="Avatar"
                                    className="md-avatar" height={32.0}/>
                            </a>
                            <strong className="black-text">BERT Corpus Visualizer</strong>
                        </MDBNavbarBrand>
                    </MDBNavbarNav>
                    <MDBNavbarNav right>
                        <MDBBtn color={"primary"} className={"analyze-btn shadow-none"} onClick={this.toggle}>Change
                            Corpora</MDBBtn>
                    </MDBNavbarNav>
                </MDBNavbar>

                <div className={"dashboard"}>

                    <MDBCard className={"general-stats"}>
                        <h5 className={"content-headline headline-margin"}><i
                            className="fas fa-chart-pie content-icon"/>
                            <b>General Statistics</b></h5>
                        <MDBRow>
                            <MDBCol md={3} className={"text-center stats-info"}>
                                <div><h1 className={"stats-value"}>{this.state.wordsa} / {this.state.wordsb}</h1><p
                                    className={"stats-description"}>NUMBER OF WORDS</p></div>
                            </MDBCol>
                            <MDBCol md={3} className={"text-center stats-info"}>
                                <div><h1 className={"stats-value"}>{this.state.vocaba} / {this.state.vocabb}</h1><p
                                    className={"stats-description"}>VOCABULARY SIZE</p></div>
                            </MDBCol>
                            <MDBCol md={3} className={"text-center stats-info"}>
                                <div><h1
                                    className={"stats-value"}>{this.state.readabilitya} / {this.state.readabilityb}</h1>
                                    <p
                                        className={"stats-description"}>READABILITY INDEX</p></div>
                            </MDBCol>
                            <MDBCol md={3} className={"text-center stats-info"}>
                                <div><h1 className={"stats-value"}>0 / 0</h1><p className={"stats-description"}>UNKNOWN
                                    METRIC</p></div>
                            </MDBCol>
                        </MDBRow>
                    </MDBCard>
                    <MDBCard className={"visualization"}>
                        <MDBRow className={"headline-margin"}><h5 className={"content-headline"}><i
                            className="fas fa-chart-line content-icon"/>
                            <b>Word Frequency Graph</b></h5>
                            <p className={"search-label"}>Filter Substring:</p>
                            <input type="email" placeholder={"Search for words ..."}
                                   className="form-control search-field" value={this.state.filterWord}
                                   onChange={this.handleSearchChange}/>

                            <p className={"filter-label"}>Number of Results:</p>
                            <input type="email" placeholder={"Results"}
                                   className="form-control freq-field" value={this.state.freq_clip}
                                   onChange={this.handleChangeFreqClip}/>
                        </MDBRow>
                        {graph}
                    </MDBCard>

                    <ModalDocument modal={this.state.modal} changeNameA={this.handleChangeNameA} analyze={this.analyze}
                                   changeDocumentA={this.handleDocumentChangeA} toggle={this.toggle}
                                   changeDocumentB={this.handleDocumentChangeB} changeNameB={this.handleChangeNameB}
                                   changeCorpus={this.handleChangeCorpus}
                                   documenta={this.state.documenta}
                                   namea={this.state.namea}
                                   documentb={this.state.documentb}
                                   nameb={this.state.nameb}/>
                </div>
            </div>
        );
    }

}

export default VisualizerApp;
