import {MDBBtn, MDBCol, MDBInput, MDBModal, MDBModalBody, MDBRow} from "mdbreact";
import React from "react";
import './index.css'

class ModalDocument extends React.Component {


    constructor(props, context) {
        super(props, context);
    }

    render() {
        const btnA = <MDBCol md={6}>
            <div className={"corpusa-div text-center"} color="corpusa">CORPUS A</div>
        </MDBCol>;
        const btnB = <MDBCol md={6}>
            <div className={"corpusb-div text-center"} color="corpusa">CORPUS B</div>
        </MDBCol>;

        return <MDBModal disableFocusTrap={true} isOpen={this.props.modal} toggle={this.props.toggle} fullHeight
                         position="bottom">
            <MDBModalBody>
                <h5 className={"modal-headline"}><b>New Document Analysis</b></h5>
                <MDBRow>
                    {btnA}
                    {btnB}
                    <MDBCol md={6} >
                        <MDBInput label="Corpus name" className={"corpusa-border"} outline
                                  onChange={this.props.changeNameA}
                                  value={this.props.namea}/>
                        <MDBInput type="textarea" className={"content-field corpusa-border"}
                                  onChange={this.props.changeDocumentA}
                                  value={this.props.documenta}
                                  label="Corpus content"
                                  outline/>
                    </MDBCol>
                    <MDBCol md={6}>
                        <MDBInput label="Corpus name" className={"corpusb-border"} outline
                                  onChange={this.props.changeNameB}
                                  value={this.props.nameb}/>
                        <MDBInput type="textarea" className={"content-field corpusb-border"}
                                  onChange={this.props.changeDocumentB}
                                  value={this.props.documentb}
                                  label="Corpus content"
                                  outline/>
                    </MDBCol>

                </MDBRow>
                <MDBBtn className={"visualize-btn shadow-none"} onClick={this.props.analyze}
                        disabled={this.props.namea === "" || this.props.nameb === "" || (this.props.documenta === "" && (this.props.documentb === ""))}
                        color="primary">Analyze</MDBBtn>
            </MDBModalBody>
        </MDBModal>
    }
}

export default ModalDocument