import React from 'react';
import './index.css';
import {
    MDBBtn,
    MDBCard, MDBCol, MDBFormInline, MDBInput, MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav, MDBRow
} from "mdbreact";

import WordFrequencyGraph from "../WordFrequencyGraph";
import ModalDocument from "../DocumentModal";

class VisualizerApp extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            modal: true,
            dataa: [],
            datab: [],
            namea: "",
            documenta: "",
            nameb: "",
            documentb: "",
            filterWord: "",
            wordsa: 0,
            vocaba: 0,
            readabilitya: 0,
            wordsb: 0,
            vocabb: 0,
            readabilityb: 0,
            corpus: "a"
        };
        this.toggle = this.toggle.bind(this);
        this.handleChangeNameA = this.handleChangeNameA.bind(this);
        this.handleChangeNameB = this.handleChangeNameB.bind(this);
        this.analyze = this.analyze.bind(this);
        this.handleDocumentChangeA = this.handleDocumentChangeA.bind(this);
        this.handleDocumentChangeB = this.handleDocumentChangeB.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    toggle() {
        this.setState(
            {
                modal: !this.state.modal
            }
        );
    }


    handleChangeNameA(event) {
        this.setState({
            namea: event.target.value
        })
    }

    handleDocumentChangeA(event) {
        this.setState({
            documenta: event.target.value
        })

    }

    handleChangeNameB(event) {
        this.setState({
            nameb: event.target.value
        })
    }

    handleDocumentChangeB(event) {
        this.setState({
            documentb: event.target.value
        })

    }

    handleSearchChange(event) {
        this.setState({
            filterWord: event.target.value
        })
    }

    analyze() {
        this.toggle();

        fetch("http://127.0.0.1:5000/handle_form", {
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "body": {
                    "text_blob": this.state.documenta
                }
            }),
            method: "POST"
        }).then(value => value.json()
        ).then(json => {
            this.setState({
                dataa: json.body.frequencies,
                wordsa: json.body.total_num_words,
                vocaba: json.body.unique_words.length
            });
        }).catch(error => {
            console.log(error)
        });

        fetch("http://127.0.0.1:5000/handle_form", {
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "body": {
                    "text_blob": this.state.documentb
                }
            }),
            method: "POST"
        }).then(value => value.json()
        ).then(json => {
            this.setState({
                datab: json.body.frequencies,
                wordsb: json.body.total_num_words,
                vocabb: json.body.unique_words.length
            });
        }).catch(error => {
            console.log(error)
        });
    }

    render() {
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
                            <input type="email" placeholder={"Search for words ..."}
                                   className="form-control search-field" value={this.state.filterWord}
                                   onChange={this.handleSearchChange}/>
                        </MDBRow>
                        <WordFrequencyGraph id={"word-frequency"} dataA={this.state.dataa} height={"calc(100% - 60px)"}
                                            filterWord={this.state.filterWord} docNameA={this.state.namea}
                                            docNameB={this.state.nameb} dataB={this.state.datab}/>
                    </MDBCard>

                    <ModalDocument modal={this.state.modal} changeNameA={this.handleChangeNameA} analyze={this.analyze}
                                   changeDocumentA={this.handleDocumentChangeA} toggle={this.toggle}
                                   changeDocumentB={this.handleDocumentChangeB} changeNameB={this.handleChangeNameB}
                                   changeCorpus={this.handleChangeCorpus}
                                   corpus={this.state.corpus}
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
