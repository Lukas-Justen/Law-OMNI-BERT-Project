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
                    <MDBBtn className={"upload-btn shadow-none"}>Upload document</MDBBtn>
                </MDBNavbarNav>
            </MDBNavbar>

            <div className={"dashboard"}>

                <MDBCard className={"general-stats"}></MDBCard>
                <MDBCard className={"visualization"}>
                    <WordFrequencyGraph id={"word-frequency"} data={[{"train":0.5, "test":0.6}, {"train": 5, "test": 20}]} height={"100%"}/>
                </MDBCard>

            </div>
        </div>
    );
  }

}

export default VisualizerApp;
