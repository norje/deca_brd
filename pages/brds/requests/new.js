import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Brd from '../../../ethereum/brd';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

class RequestNew extends Component {
  state = {
    value: '',
    description: '',
    recipient: '',
    // secondRecipient: '',
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();

    const brd = Brd(this.props.address);
    const { description, value, recipient, secondRecipient } = this.state;

    this.setState({ loading: true, errorMessage: '' });
    try {
      const accounts = await web3.eth.getAccounts();
      await brd.methods
        .createRequest(
          description,
          web3.utils.toWei(value, 'ether'),
          recipient,
          secondRecipient
        )
        .send({ from: accounts[0] });

      Router.pushRoute(`/brds/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/brds/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Deal</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Value (ETH)</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Winning Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Losing Recipient</label>
            <Input
              value={this.state.secondRecipient}
              onChange={event =>
                this.setState({ secondRecipient: event.target.value })
              }
            />
          </Form.Field>
          <Message
            error
            header='Something went wrong:'
            content={this.state.errorMessage}
          />
          <Button color='green' loading={this.state.loading}>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
