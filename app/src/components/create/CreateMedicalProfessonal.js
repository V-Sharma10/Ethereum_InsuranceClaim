import React, {Component} from 'react';
import { Grid, TextField,Button, Box, Typography, Card } from '@material-ui/core';

class CreateMedicalProfessional extends Component{
    state = {
        name: '',
        address: '',
        txId: '',

        web3: {},
        contract:{},
        events: [],

        drizzle: {},
        dirzzleState: {},
        Insurance: {},
    };

    componentDidMount(){
        const { web3, contracts } = this.props.drizzle;
        const { Insurance } = contracts;
        const { abi, address } = Insurance;
        const contract = new web3.eth.Contract(abi,address);
    
        this.setState({web3,contract});

        const { drizzle, drizzleState } = this.props;

        this.setState({drizzle, drizzleState, Insurance});

        let events = [];
        contract.events.medicalProfessionalAdded(
            {
                fromBlock: 0
            }, 
            (err, event) => {
                console.log(event);
                events.push(event);
                this.setState({events});
            }
        );

        // console.log(drizzleState.accounts[0]);
        // console.log(Insurance.methods['addClient']);
        // console.log(this.props.drizzleState);
    }

    handleNameChange = e => {
        this.setState({name: e.target.value});
    }

    handleAddressChange = e => {
        this.setState({address: e.target.value});
    }

    handleClick = e => {
        e.preventDefault();
        
        const { Insurance, name, address } = this.state;
        const { accounts } = this.state.drizzleState
        
        const txId = Insurance
            .methods['addMedicalProfessional']
            .cacheSend(
                address, name,
                {from: accounts[0]}
            );
        this.setState({txId});

        // console.log(Insurance.methods['addMedicalProfessional']);
        // console.log(accounts[0]);
        // console.log(name);
    }
    render(){
        const {transactions, transactionStack } = this.props.drizzleState;
        const txHash = transactionStack[this.state.txId];
        // console.log()

        return(
            <Grid
            container
                direction = "row"
                justify = "center"
                alignItems = "center"
                xs={12}
                md={12}
                lg={6}>
                    <Card raised='true' style={{width:'90vh',justifyContent:'center',alignContent:'center',textAlign:'center'}}>
                <Grid
                container
                direction = "row"
                justify = "center"
                alignItems = "center"
                xs={12}
                md={12}
                lg={6}
                >
                <TextField
                    id="filled-textarea"
                    label="Doctor's Name"
                    placeholder="Name of the Doctor"
                    multiline
                    fullWidth
                    margin="normal"
                    variant="filled"
                    />
                {/* </Grid>
                <Grid
                container
                direction = "row"
                justify = "center"
                alignItems = "center"
                xs={12}
                md={12}
                lg={6}
                > */}
                <TextField
                    id="filled-textarea"
                    label="Doctor's Address"
                    placeholder="Address of the Doctor"
                    multiline
                    fullWidth
                    margin="normal"
                    variant="filled"
                    />
                </Grid>
                <form>
                    Enter Medical Professional's name: <input type="text" onChange={this.handleNameChange} 
                    id="mname"/>
                    <br/>
                    Enter Medical Professional's address: <input type="text" onChange={this.handleAddressChange} 
                    id="maddress"/>
                    <br/>
                    <button onClick={this.handleClick}>Submit</button>
                </form>
                <p>{txHash ? `Transaction status: ${transactions[txHash]
                && transactions[txHash].status}`: null}</p>
            </Card>
            </Grid>
        )
    }
}

export default CreateMedicalProfessional;