const { React, getModule } = require('powercord/webpack');

const { Tooltip } = require('powercord/components');

let classes;
setImmediate(async () => {
  classes = { ...await getModule([ 'wrapper', 'inner' ]) };
});

module.exports = class ConnectAccountButton extends React.Component {
  constructor (props) {
    super();

    this.connection = powercord.api.connections.get(props.type);
  }

  handleClick () {
    this.props.onConnect();
  }

  render () {
    return <>
      <Tooltip color='black' postion='top' text={this.connection.name}>
        <div className={[ classes.wrapper, this.props.className ].filter(Boolean).join(' ')}>
          <button
            className={[ classes.inner, this.props.innerClassName ].filter(Boolean).join(' ')}
            type='button'
            disabled={this.props.disabled}
            style={{ backgroundImage: `url(${this.connection.icon.color})` }}
            onClick={this.handleClick.bind(this)}
            aria-label={this.connection.name}
          >
          </button>
        </div>
      </Tooltip>
    </>;
  }
};