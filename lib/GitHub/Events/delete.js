const EventResponse = require('../EventResponse');

class Delete extends EventResponse {
  constructor(...args) {
    super(...args, {
      description: `This response is fired whenever a branch is deleted.`,
    });
  }
  embed(data) {
    return {
      title: `Deleted ${data.ref_type} \`${data.ref}\``,
      color: `FF9900`,
    };
  }
  text(data) {
    return [`🌲 **${data.sender.login}** deleted ${data.ref_type} \`${data.ref}\``];
  }
}

module.exports = Delete;
