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
            data: [],
            name: "",
            document: "",
            filterWord: "",
            words: 0,
            vocab: 0,
            readability: 0
        };
        this.toggle = this.toggle.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.analyze = this.analyze.bind(this);
        this.handleDocumentChange = this.handleDocumentChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    toggle() {
        this.setState(
            {
                modal: !this.state.modal
            }
        );
    }

    handleChangeName(event) {
        this.setState({
            name: event.target.value
        })
    }

    handleDocumentChange(event) {
        this.setState({
            document: event.target.value
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
                    "text_blob": this.state.document
                }
            }),
            method: "POST"
        }).then(value => value.json()
        ).then(json => {
            this.setState({
                data: json.body.frequencies,
                words: json.body.total_num_words,
                vocab: json.body.unique_words.length
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
                        <MDBBtn color={"primary"} className={"analyze-btn shadow-none"} onClick={this.toggle}>Change Corpora</MDBBtn>
                    </MDBNavbarNav>
                </MDBNavbar>

                <div className={"dashboard"}>

                    <MDBCard className={"general-stats"}>
                        <h5 className={"content-headline headline-margin"}><i className="fas fa-chart-pie content-icon"/>
                            <b>General Statistics</b></h5>
                        <MDBRow>
                            <MDBCol md={3} className={"text-center stats-info"}>
                                <div><h1 className={"stats-value"}>{this.state.words}</h1><p
                                    className={"stats-description"}>NUMBER OF WORDS</p></div>
                            </MDBCol>
                            <MDBCol md={3} className={"text-center stats-info"}>
                                <div><h1 className={"stats-value"}>{this.state.vocab}</h1><p
                                    className={"stats-description"}>VOCABULARY SIZE</p></div>
                            </MDBCol>
                            <MDBCol md={3} className={"text-center stats-info"}>
                                <div><h1 className={"stats-value"}>{this.state.readability}</h1><p
                                    className={"stats-description"}>READABILITY INDEX</p></div>
                            </MDBCol>
                            <MDBCol md={3} className={"text-center stats-info"}>
                                <div><h1 className={"stats-value"}>0</h1><p className={"stats-description"}>UNKNOWN
                                    METRIC</p></div>
                            </MDBCol>
                        </MDBRow>
                    </MDBCard>
                    <MDBCard className={"visualization"}>
                        <MDBRow className={"headline-margin"}><h5 className={"content-headline"}><i className="fas fa-chart-line content-icon"/>
                            <b>Word Frequency Graph</b></h5>
                                <input type="email" placeholder={"Search for words ..."} className="form-control search-field" value={this.state.filterWord} onChange={this.handleSearchChange} />
                            </MDBRow>
                        <WordFrequencyGraph id={"word-frequency"} data={this.state.data} height={"calc(100% - 60px)"}
                                            filterWord={this.state.filterWord} docName={this.state.name}/>
                    </MDBCard>

                    <ModalDocument modal={this.state.modal} changeName={this.handleChangeName} analyze={this.analyze}
                                   changeDocument={this.handleDocumentChange} toggle={this.toggle}
                                   document={this.state.document}
                                   name={this.state.name}/>
                </div>
            </div>
        );
    }

}

export default VisualizerApp;
