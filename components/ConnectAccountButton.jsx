const { React, getModule } = require('powercord/webpack');

const { Tooltip } = require('powercord/components');
let classes;
setImmediate(async () => {
  classes = {
    ...await getModule([ 'wrapper', 'inner' ]),
    ...await getModule([ 'accountBtn' ])
  };
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
      <Tooltip
        disableTooltipPointerEvents = {true}
        hideOnClick = {true}
        position = "top"
        color = "black"
        forceOpen = {false}
        spacing = {8}
        shouldShow = {true}
        allowOverflow = {false}
        text={this.connection.name}
        className={[ classes.wrapper, classes.accountBtn, this.props.className ].filter(Boolean).join(' ')}>
        <div>
          <button
            className={[ classes.inner, classes.accountBtnInner, this.props.innerClassName ].filter(Boolean).join(' ')}
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
