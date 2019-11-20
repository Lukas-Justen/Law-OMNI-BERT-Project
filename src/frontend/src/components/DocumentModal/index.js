import {MDBBtn, MDBCol, MDBInput, MDBModal, MDBModalBody, MDBRow} from "mdbreact";
import React from "react";
import './index.css'

class ModalDocument extends React.Component{
    render() {
        return <MDBModal isOpen={this.props.modal} toggle={this.props.toggle} fullHeight position="bottom">
            <MDBModalBody>
                <h5 className={"modal-headline"}><b>New Document Analysis</b></h5>
                <MDBInput label="Document name" outline onChange={this.props.changeName} value={this.props.name}/>
                <MDBInput type="textarea" className={"content-field"} onChange={this.props.changeDocument} label="Document content" outline />
                <MDBRow>
                    <MDBCol md={6}>
                        <MDBBtn className={"close-btn shadow-none"}  onClick={this.props.toggle} color="primary">Close</MDBBtn></MDBCol>
                    <MDBCol md={6}>
                        <MDBBtn className={"visualize-btn shadow-none"}  onClick={this.props.analyze} color="primary">Analyze</MDBBtn></MDBCol>
                </MDBRow>
            </MDBModalBody>
        </MDBModal>
    }
}

export default ModalDocument