import React from 'react';
import './index.css';
import {MDBBtn, MDBCard, MDBNavbar, MDBNavbarBrand, MDBNavbarNav} from "mdbreact";
import WordFrequencyGraph from "../WordFrequencyGraph";

class VisualizerApp extends React.Component {

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
                        <MDBBtn color={"primary"} className={"upload-btn shadow-none"}>Upload document</MDBBtn>
                    </MDBNavbarNav>
                </MDBNavbar>

                <div className={"dashboard"}>

                    <MDBCard className={"general-stats"}></MDBCard>
                    <MDBCard className={"visualization"}>
                        <h5 className={"content-headline"}><i className="fas fa-chart-line content-icon"/>
                            <b>Word Frequency Graph</b></h5>
                        <WordFrequencyGraph id={"word-frequency"} data={[
                            {"word": "Hello", "freq": 120},
                            {"word": "sfdsdf", "freq": 100},
                            {"word": "Hesdfdllo", "freq": 100},
                            {"word": "Hedllo", "freq": 100},
                            {"word": "LOL", "freq": 83},
                            {"word": "Test", "freq": 80},
                            {"word": "7", "freq": 80},
                            {"word": "Te676st", "freq": 80},
                            {"word": "676", "freq": 80},
                            {"word": "ghg", "freq": 80},
                            {"word": "Na", "freq": 80},
                            {"word": "Yes","freq": 79},
                            {"word": "dfjhs", "freq": 55},
                            {"word": "dfvds", "freq": 48},
                            {"word": "sdf", "freq": 44},
                            {"word": "sdfsd","freq": 40},
                            {"word": "ghngg", "freq": 39},
                            {"word": "ggg", "freq": 39},
                            {"word": "hhh", "freq": 20},
                            {"word": "ghnhjhj","freq": 10},
                            {"word": "Why", "freq": 5}]} height={"calc(100% - 60px)"}/>
                    </MDBCard>

                </div>
            </div>
        );
    }

}

export default VisualizerApp;
